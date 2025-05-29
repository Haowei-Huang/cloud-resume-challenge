variable "sub_www_domain_name" {
  description = "The www sub domain to be created"
  type        = string
  default     = "www.sample.com"
}

variable "root_domain_name" {
  description = "The root domain to be created"
  type        = string
  default     = "sample.com"
}

variable "dynamodb_table_name" {
  description = "The name of the DynamoDB table"
  type        = string
  default     = "visitor_ip_address"
}

variable "dynamodb_table_primary_key" {
  description = "The primary key of the DynamoDB table"
  type        = string
  default     = "ip_address"
}

variable "lambda_access_control_allow_origin" {
  description = "The access control allow origin for the Lambda function"
  type        = string
  default     = "https://www.sample.com"
}

variable "lambda_function_name" {
  description = "The name of the Lambda function"
  type        = string
  default     = "unique_visitor_count"
}

variable "api_gateway_name" {
  description = "The name of the api gateway before lambda"
  type        = string
  default     = "api_gateway_for_lambda"
}

variable "aws_api_gateway_resource_name" {
  description = "Api gateway resource name"
  type        = string
  default     = "visitor_count"
}
