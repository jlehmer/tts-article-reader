resource "aws_sns_topic" "tts_results" {
  name = "tts-results"
}

resource "aws_sns_topic_subscription" "tts_result_lambda_subscription" {
  topic_arn = aws_sns_topic.tts_results.arn
  protocol  = "lambda"
  endpoint  = module.tts_result_lambda.lambda_function_arn
}
