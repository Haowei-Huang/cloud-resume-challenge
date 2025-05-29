resource "aws_route53_record" "sub_www_record" {
  zone_id = data.aws_route53_zone.root_domain_zone.zone_id
  name    = var.sub_www_domain_name
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.sub_www_domain_s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.sub_www_domain_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}

resource "aws_route53_record" "root_record" {
  zone_id = data.aws_route53_zone.root_domain_zone.zone_id
  name    = var.root_domain_name
  type    = "A"
  alias {
    name                   = aws_cloudfront_distribution.root_domain_s3_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.root_domain_s3_distribution.hosted_zone_id
    evaluate_target_health = false
  }
}
