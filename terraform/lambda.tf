
module "article_reader_lambda" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "article-reader"
  description   = "Lambda function that extracts article text"
  handler       = "ArticleReader.articleReader"
  runtime       = "nodejs16.x"

  timeout        = 300
  create_package = false
  s3_existing_package = {
    bucket = aws_s3_bucket.build.id
    key    = aws_s3_object.tts_article_reader.id
  }

  environment_variables = {
    EXTRACT_API_HOST = var.article_extract_api_host
    EXTRACT_API_KEY  = var.article_extract_api_key
  }
}
