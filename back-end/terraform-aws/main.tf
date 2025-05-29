terraform {
  cloud {

    organization = "your-organization-name" // replace with your Terraform Cloud organization name

    workspaces {
      name = "learn-terraform-github-actions"
    }
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.16"
    }
  }

  required_version = ">= 1.2.0"
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_s3_bucket" "root_domain_bucket" {
  bucket = var.root_domain_name
}


// static website hosting with redirect request to the root domain, https
resource "aws_s3_bucket_website_configuration" "root_domain_bucket_website" {
  bucket = aws_s3_bucket.root_domain_bucket.id

  // redirect all requests to the sub www domain
  redirect_all_requests_to {
    host_name = var.sub_www_domain_name
    protocol  = "https"
  }
}

resource "aws_s3_bucket" "sub_www_domain_bucket" {
  bucket = var.sub_www_domain_name
  // versioning,  bucket policy for cloudfront s3:GetObject
}

// sub domain bucket versioning
resource "aws_s3_bucket_versioning" "sub_www_domain_bucket_versioning" {
  bucket = aws_s3_bucket.sub_www_domain_bucket.id

  versioning_configuration {
    status = "Enabled"
  }
}

// sub www domain bucket policy
resource "aws_s3_bucket_policy" "sub_www_domain_bucket_policy" {
  bucket = aws_s3_bucket.sub_www_domain_bucket.id
  policy = data.aws_iam_policy_document.sub_www_domain_bucket_policy.json
}

data "aws_iam_policy_document" "sub_www_domain_bucket_policy" {
  statement {
    sid    = "AllowCloudFrontServicePrincipal"
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["cloudfront.amazonaws.com"]
    }

    actions = ["s3:GetObject"]

    resources = [
      "${aws_s3_bucket.sub_www_domain_bucket.arn}/*" // access to all objects in the bucket
    ]

    condition {
      test     = "StringEquals"
      variable = "AWS:SourceArn"
      values   = [aws_cloudfront_distribution.sub_www_domain_s3_distribution.arn]
    }
  }
}
