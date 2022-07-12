resource "aws_iam_policy" "article_reader_iam_policy" {
  name = "article-reader-lambda-policy"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
          "dynamodb:PutItem"
      ],
      "Resource": ["${aws_dynamodb_table.article_table.arn}"]
    },
    {  
      "Effect": "Allow",
      "Action": [
        "polly:StartSpeechSynthesisTask",
        "polly:GetSpeechSynthesisTask",
        "polly:ListSpeechSynthesisTasks"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:PutObject",
      "Resource": ["${aws_s3_bucket.tts_result.arn}/*"]
    },
    {
      "Effect": "Allow",
      "Action": "sns:Publish",
      "Resource": ["${aws_sns_topic.tts_results.arn}"]
    }
  ]
}
POLICY
}

resource "aws_iam_policy" "tts_result_iam_policy" {
  name = "tts-result-lambda-policy"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
          "dynamodb:PutItem"
      ],
      "Resource": ["${aws_dynamodb_table.article_table.arn}"]
    }
  ]
}
POLICY
}
