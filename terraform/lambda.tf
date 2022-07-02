
module "article_reader_lambda" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "article-reader"
  description   = "Lambda function that extracts article text"
  handler       = "ArticleReader.articleReader"
  runtime       = "node16.x"

  create_package = false
  s3_existing_package = {
    bucket = aws_s3_bucket.build.id
    key    = aws_s3_object.my_function.id
  }
}
