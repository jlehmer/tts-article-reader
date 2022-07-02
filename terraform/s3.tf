################################################
# Lambda build bucket
################################################
locals {
  lambda_source = "../dist/handler.zip"
}
resource "aws_s3_bucket" "build" {
  bucket = "tts-article-reader-build"
}

resource "aws_s3_bucket_acl" "build_bucket_acl" {
  bucket = aws_s3_bucket.build.id
  acl    = "private"
}

resource "aws_s3_object" "tts_article_reader" {
  bucket = aws_s3_bucket.build.id
  key    = "${filemd5(local.lambda_source)}.zip"
  source = local.lambda_source
}

################################################
# Terraform bucket
################################################
resource "aws_s3_bucket" "tfstate" {
  bucket = var.tfstate_bucketname
}

resource "aws_s3_bucket_acl" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  acl    = "private"
}

resource "aws_s3_bucket_versioning" "tfstate" {
  bucket = aws_s3_bucket.tfstate.id
  versioning_configuration {
    status = "Enabled"
  }
}
