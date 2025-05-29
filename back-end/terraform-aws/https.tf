resource "aws_acm_certificate" "root_domain_certificate" {
  domain_name               = var.root_domain_name
  subject_alternative_names = ["*.${var.root_domain_name}"]
  validation_method         = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

// domain hosted zone to add the certificate validation record
data "aws_route53_zone" "root_domain_zone" {
  name         = var.root_domain_name
  private_zone = false
}

// create dns records for domain validation
resource "aws_route53_record" "root_domain_certificate_validation_record" {
  for_each = {
    for dvo in aws_acm_certificate.root_domain_certificate.domain_validation_options : dvo.domain_name => {
      name    = dvo.resource_record_name
      record  = dvo.resource_record_value
      type    = dvo.resource_record_type
      zone_id = data.aws_route53_zone.root_domain_zone.zone_id
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 300
  type            = each.value.type
  zone_id         = each.value.zone_id
}

// tell ACM to validate the certificate once the DNS record is created
// validate the certificate of the sub domains
resource "aws_acm_certificate_validation" "root_domain_certificate_validation" {
  certificate_arn = aws_acm_certificate.root_domain_certificate.arn

  validation_record_fqdns = [
    for record in aws_route53_record.root_domain_certificate_validation_record :
    record.fqdn
  ]
}

locals {
  www_sub_origin_id = "wwwSubDomainS3Origin" // you can set it to any value, but it must be unique within the distribution
  root_origin_id    = "rootDomainS3Origin"   // you can set it to any value, but it must be unique within the distribution
}

// original access control for cloudfront
resource "aws_cloudfront_origin_access_control" "sub_www_oac" {
  name                              = aws_s3_bucket.sub_www_domain_bucket.bucket_regional_domain_name
  description                       = "Default OAC for sub domain www CloudFront"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

data "aws_cloudfront_cache_policy" "managed_caching_optimized" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_response_headers_policy" "cors_security_response_headers_policy" {
  name    = "cors_security_response_headers_policy"
  comment = "response headers policy for CORS and security"

  cors_config {
    access_control_allow_credentials = false // whether to allow credentials sent in the request
    access_control_allow_headers {
      items = ["*"]
    }

    access_control_allow_methods {
      items = ["GET", "HEAD"]
    }

    access_control_allow_origins {
      items = ["https://*.${var.root_domain_name}"]
    }

    access_control_max_age_sec = 600

    origin_override = true
  }

  security_headers_config {
    frame_options {
      frame_option = "SAMEORIGIN"
      override     = false
    }

    xss_protection {
      mode_block = true
      override   = false
      protection = true
    }

    strict_transport_security {
      access_control_max_age_sec = 31536000
      override                   = false
    }

    content_type_options {
      override = false
    }

  }
}


// cloudfront distribution
// no option to enable waf using a boolean flag yet
resource "aws_cloudfront_distribution" "sub_www_domain_s3_distribution" {
  origin {
    domain_name              = aws_s3_bucket.sub_www_domain_bucket.bucket_regional_domain_name
    origin_access_control_id = aws_cloudfront_origin_access_control.sub_www_oac.id
    origin_id                = local.www_sub_origin_id
  }

  enabled             = true
  is_ipv6_enabled     = true
  comment             = "CloudFront for sub www domain"
  default_root_object = "index.html"
  http_version        = "http2"

  aliases = [var.sub_www_domain_name]

  default_cache_behavior {
    cache_policy_id            = data.aws_cloudfront_cache_policy.managed_caching_optimized.id
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = local.www_sub_origin_id
    compress                   = true
    response_headers_policy_id = aws_cloudfront_response_headers_policy.cors_security_response_headers_policy.id
    viewer_protocol_policy     = "https-only"
  }

  price_class = "PriceClass_100"
  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["CA", "US"]
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn            = aws_acm_certificate.root_domain_certificate.arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }
}

resource "aws_cloudfront_distribution" "root_domain_s3_distribution" {
  origin {
    domain_name = aws_s3_bucket_website_configuration.root_domain_bucket_website.website_endpoint
    origin_id   = local.root_origin_id

    // this is required for using the static s3 hosted website endpoint
    custom_origin_config {
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  enabled         = true
  is_ipv6_enabled = true
  comment         = "CloudFront for root domain"
  http_version    = "http2"

  aliases = [var.root_domain_name]

  default_cache_behavior {
    cache_policy_id            = data.aws_cloudfront_cache_policy.managed_caching_optimized.id
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = local.root_origin_id
    compress                   = true
    response_headers_policy_id = aws_cloudfront_response_headers_policy.cors_security_response_headers_policy.id
    viewer_protocol_policy     = "https-only"
  }

  price_class = "PriceClass_100"
  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["CA", "US"]
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = false
    acm_certificate_arn            = aws_acm_certificate.root_domain_certificate.arn
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }
}
