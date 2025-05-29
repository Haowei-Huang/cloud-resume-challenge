// required for lambda function to function
data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda_${var.lambda_function_name}"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

# Archive a file to be used with Lambda using consistent file mode
data "archive_file" "lambda" {
  type             = "zip"
  source_file      = "./lambda_function/lambda.py"
  output_file_mode = "0666"
  output_path      = "./lambda.zip"
}

resource "aws_lambda_function" "visitor_count_lambda_function" {
  function_name = var.lambda_function_name
  filename      = data.archive_file.lambda.output_path
  role          = aws_iam_role.iam_for_lambda.arn
  handler       = "lambda.lambda_handler"
  runtime       = "python3.9"

  source_code_hash = data.archive_file.lambda.output_base64sha256

  environment {
    variables = {
      TABLE_NAME                  = var.dynamodb_table_name
      PRIMARY_KEY                 = var.dynamodb_table_primary_key
      ACCESS_CONTROL_ALLOW_ORIGIN = var.lambda_access_control_allow_origin
    }
  }
}

// get the current AWS account ID
data "aws_caller_identity" "current" {}
data "aws_region" "current" {}

// basic logging policy for lambda function
data "aws_iam_policy_document" "lambda_logging" {
  statement {
    sid    = "AllowCreateLogGroup"
    effect = "Allow"

    actions = [
      "logs:CreateLogGroup"
    ]

    resources = ["arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:*"]
  }
  statement {
    sid    = "AllowCreateLogStream"
    effect = "Allow"
    actions = [
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["arn:aws:logs:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:log-group:/aws/lambda/${aws_lambda_function.visitor_count_lambda_function.function_name}:*"]
  }
}

// IAM policy for lambda logging
resource "aws_iam_policy" "lambda_logging" {
  name        = "lambda_logging_visitor_count"
  path        = "/"
  description = "IAM policy for lambda logging"
  policy      = data.aws_iam_policy_document.lambda_logging.json
}

// attach policy to role
resource "aws_iam_role_policy_attachment" "lambda_logging" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.lambda_logging.arn
}

// IAM policy for DynamoDB access
data "aws_iam_policy_document" "dynamodb_access" {
  statement {
    sid    = "AllowDynamoDBActions"
    effect = "Allow"

    actions = [
      "dynamodb:CreateTable",
      "dynamodb:DescribeTable",
      "dynamodb:BatchGetItem",
      "dynamodb:GetItem",
      "dynamodb:Query",
      "dynamodb:Scan",
      "dynamodb:BatchWriteItem",
      "dynamodb:PutItem",
      "dynamodb:UpdateItem"
    ]

    resources = [aws_dynamodb_table.visitor_stats.arn]
  }
  statement {
    sid    = "AllowDynamoDBStreamActions"
    effect = "Allow"

    actions = [
      "dynamodb:GetRecords"
    ]

    resources = ["${aws_dynamodb_table.visitor_stats.arn}/stream/*"]
  }
}

// IAM policy for DynamoDB access
resource "aws_iam_policy" "dynamodb_access" {
  name        = "lambda_dynamodb_access_visitor_count"
  path        = "/"
  description = "IAM policy for DynamoDB access"
  policy      = data.aws_iam_policy_document.dynamodb_access.json
}

// attach policy to role
resource "aws_iam_role_policy_attachment" "dynamodb_access" {
  role       = aws_iam_role.iam_for_lambda.name
  policy_arn = aws_iam_policy.dynamodb_access.arn
}

resource "aws_api_gateway_rest_api" "gateway_rest_api" {
  name        = var.api_gateway_name
  description = "API Gateway for ${aws_lambda_function.visitor_count_lambda_function.function_name} Lambda function"
}

// api gateway resource
resource "aws_api_gateway_resource" "api_resource" {
  parent_id   = aws_api_gateway_rest_api.gateway_rest_api.root_resource_id
  path_part   = var.aws_api_gateway_resource_name
  rest_api_id = aws_api_gateway_rest_api.gateway_rest_api.id
}

resource "aws_api_gateway_method" "api_method" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_rest_api.id
  resource_id   = aws_api_gateway_resource.api_resource.id
  http_method   = "POST"
  authorization = "NONE"
}

// CORS configuration for the API Gateway
resource "aws_api_gateway_method" "cors_options" {
  rest_api_id   = aws_api_gateway_rest_api.gateway_rest_api.id
  resource_id   = aws_api_gateway_resource.api_resource.id
  http_method   = "OPTIONS"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.gateway_rest_api.id
  resource_id             = aws_api_gateway_resource.api_resource.id
  http_method             = aws_api_gateway_method.api_method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY" // AWS_PROXY for Lambda integration
  uri                     = aws_lambda_function.visitor_count_lambda_function.invoke_arn
}

resource "aws_api_gateway_integration" "cors_integration" {
  depends_on  = [aws_api_gateway_method.cors_options] // ensure the method is created before the integration
  rest_api_id = aws_api_gateway_rest_api.gateway_rest_api.id
  resource_id = aws_api_gateway_resource.api_resource.id
  http_method = aws_api_gateway_method.cors_options.http_method
  type        = "MOCK" // AWS_PROXY for Lambda integration

  request_templates = {
    "application/json" = jsonencode({
      statusCode = 200
    })
  }
}

resource "aws_api_gateway_integration_response" "cors_integration_response" {
  depends_on  = [aws_api_gateway_method_response.cors_method_response] // ensure the integration is created before the integration response
  rest_api_id = aws_api_gateway_rest_api.gateway_rest_api.id
  resource_id = aws_api_gateway_resource.api_resource.id
  http_method = aws_api_gateway_method.cors_options.http_method
  status_code = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'OPTIONS,POST'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
}

resource "aws_api_gateway_method_response" "cors_method_response" {
  rest_api_id = aws_api_gateway_rest_api.gateway_rest_api.id
  resource_id = aws_api_gateway_resource.api_resource.id
  http_method = aws_api_gateway_method.cors_options.http_method
  status_code = "200"

  response_models = {
    "application/json" = "Empty"
  }

  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

resource "aws_api_gateway_deployment" "api_deployment" {
  depends_on = [
    aws_api_gateway_integration.integration,
    aws_api_gateway_integration.cors_integration,
    aws_api_gateway_method.api_method,
    aws_api_gateway_method.cors_options
  ]
  rest_api_id = aws_api_gateway_rest_api.gateway_rest_api.id

  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_resource.api_resource.id,
      aws_api_gateway_method.api_method.id,
      aws_api_gateway_integration.integration.id,
      aws_api_gateway_method.cors_options.id,
      aws_api_gateway_integration.cors_integration.id,
      aws_api_gateway_integration_response.cors_integration_response.id,
      aws_api_gateway_method_response.cors_method_response.id
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "dev_stage" {
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.gateway_rest_api.id
  stage_name    = "dev"
}

resource "aws_api_gateway_method_settings" "all" {
  rest_api_id = aws_api_gateway_rest_api.gateway_rest_api.id
  stage_name  = aws_api_gateway_stage.dev_stage.stage_name
  method_path = "*/*"

  settings {
    throttling_burst_limit = 50
    throttling_rate_limit  = 20
  }
}

// Lambda permission to allow API Gateway to invoke the Lambda function
resource "aws_lambda_permission" "apigw_lambda" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.visitor_count_lambda_function.function_name
  principal     = "apigateway.amazonaws.com"

  # More: http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-control-access-using-iam-policies-to-invoke-api.html
  source_arn = "arn:aws:execute-api:${data.aws_region.current.name}:${data.aws_caller_identity.current.account_id}:${aws_api_gateway_rest_api.gateway_rest_api.id}/*/${aws_api_gateway_method.api_method.http_method}${aws_api_gateway_resource.api_resource.path}"
}

// output the API URL and website URL for end-to-end testing in GitHub Actions
output "test_api_url" {
  description = "value of the test API URL"
  value       = "https://${aws_api_gateway_rest_api.gateway_rest_api.id}.execute-api.${data.aws_region.current.name}.amazonaws.com/${aws_api_gateway_stage.dev_stage.stage_name}${aws_api_gateway_resource.api_resource.path}"
  sensitive   = true
}

output "test_website_url" {
  description = "value of the test website URL"
  value       = "https://${var.root_domain_name}"
  sensitive   = true
}
