###################################################
# Todoist events
###################################################

resource "aws_iam_policy" "todoist_item_events" {
  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
          "lambda:Invoke*"
      ],
      "Resource": ["${module.article_reader_lambda.lambda_function_arn}"]
    }
  ]
}
POLICY
}

resource "aws_sns_topic" "todoist_item_events" {
  name   = "todoist-item-events"
  policy = aws_iam_policy.todoist_item_events.policy

  lambda_failure_feedback_role_arn = aws_iam_role.sns_log_role.arn
  
}

resource "aws_sns_topic_subscription" "article_reader_lambda_subscription" {
  topic_arn = aws_sns_topic.todoist_item_events.arn
  protocol  = "lambda"
  endpoint  = module.article_reader_lambda.lambda_function_arn
}

###################################################
# Text to speech (TTS) results
###################################################
resource "aws_sns_topic" "tts_results" {
  name = "tts-results"

  lambda_failure_feedback_role_arn = aws_iam_role.sns_log_role.arn
}

resource "aws_sns_topic_subscription" "tts_result_lambda_subscription" {
  topic_arn = aws_sns_topic.tts_results.arn
  protocol  = "lambda"
  endpoint  = module.tts_result_lambda.lambda_function_arn
}
