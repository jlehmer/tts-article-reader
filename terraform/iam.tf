resource "aws_iam_policy" "article_reader_iam_policy" {
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
    },
    {
      "Effect": "Allow",
      "Action": [
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords"
      ],
      "Resource": "*"
    }
  ]
}
POLICY
}

resource "aws_iam_policy" "tts_result_iam_policy" {
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
          "xray:PutTraceSegments",
          "xray:PutTelemetryRecords"
      ],
      "Resource": "*"
    }
  ]
}
POLICY
}

resource "aws_iam_role" "sns_log_role" {
  name = "sns_log_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "logs:CreateLogStream",
          "logs:DescribeLogStreams",
          "logs:PutRetentionPolicy",
          "logs:CreateLogGroup"
        ]
        Effect = "Allow"
        Principal = "*"
      },
    ]
  })
}
