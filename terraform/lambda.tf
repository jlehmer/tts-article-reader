################################################
# Article reader lambda
################################################
module "article_reader_lambda" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "article-reader"
  description   = "Lambda function that extracts article text"
  handler       = "ArticleReaderHandler.articleReader"
  runtime       = "nodejs16.x"

  timeout        = 300
  create_package = false
  s3_existing_package = {
    bucket = aws_s3_bucket.build.id
    key    = aws_s3_object.tts_article_reader.id
  }

  environment_variables = {
    ARTICLE_TABLE_NAME     = var.article_table_name
    EXTRACT_API_HOST       = var.article_extract_api_host
    EXTRACT_API_KEY        = var.article_extract_api_key
    TTS_RESULT_BUCKET_NAME = aws_s3_bucket.tts_result.id
    TTS_RESULT_TOPIC_ARN   = aws_sns_topic.tts_results.arn
  }

  attach_policy = true
  policy        = aws_iam_policy.article_reader_iam_policy.arn
}

################################################
# Text to speech result lambda
################################################
module "tts_result_lambda" {
  source = "terraform-aws-modules/lambda/aws"

  function_name = "tts-result"
  description   = "Lambda function that text to speech result"
  handler       = "TtsResultHandler.receiveTtsResult"
  runtime       = "nodejs16.x"
  publish       = true

  timeout        = 20
  create_package = false
  s3_existing_package = {
    bucket = aws_s3_bucket.build.id
    key    = aws_s3_object.tts_article_reader.id
  }

  environment_variables = {
    ARTICLE_TABLE_NAME = var.article_table_name
  }

  allowed_triggers = {
    SnsTopicTrigger = {
      principal  = "sns.amazonaws.com"
      source_arn = aws_sns_topic.tts_results.arn
    }
  }

  attach_policy = true
  policy        = aws_iam_policy.tts_result_iam_policy.arn
}

