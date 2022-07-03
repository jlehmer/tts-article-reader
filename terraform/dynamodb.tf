################################################
# Article table
################################################
resource "aws_dynamodb_table" "article_table" {
  name      = var.article_table_name
  hash_key  = "PK"
  range_key = "SK"

  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }
}

################################################
# Terraform state table
################################################
resource "aws_dynamodb_table" "terraform-state-lock" {
  name           = "terraform-state-lock"
  hash_key       = "LockID"
  read_capacity  = 1
  write_capacity = 1

  attribute {
    name = "LockID"
    type = "S"
  }
}
