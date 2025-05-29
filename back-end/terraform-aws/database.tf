resource "aws_dynamodb_table" "visitor_stats" {
  name         = var.dynamodb_table_name
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "ip_address"

  attribute {
    name = "ip_address"
    type = "S"
  }
}
