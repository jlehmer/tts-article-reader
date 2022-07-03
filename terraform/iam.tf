resource "aws_iam_policy" "lambda_iam_policy" {
  name = "article-reader-lambda-policy"

  policy = <<POLICY
{
  "Version": "2012-10-17",
  "Statement": {
      "Sid": "APIAccessForDynamoDBStreams",
      "Effect": "Allow",
      "Action": [
          "dynamodb:PutItem"
      ],
      "Resource": ["${aws_dynamodb_table.article_table.arn}"]
  }
}
POLICY
}
