locals {
  article_reader_domain = "article-reader.jasonlehmer.com"
}

resource "aws_api_gateway_rest_api" "article_reader" {
  name          = "article-reader-gateway"
}

resource "aws_api_gateway_resource" "api" {
  parent_id   = aws_api_gateway_rest_api.article_reader.root_resource_id
  path_part   = "api"
  rest_api_id = aws_api_gateway_rest_api.article_reader.id
}

resource "aws_api_gateway_domain_name" "article_reader" {
  domain_name = local.article_reader_domain
  regional_certificate_arn = aws_acm_certificate.article_reader_domain.arn
  
  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

resource "aws_route53_record" "api_gateway_alias" {
  name    = aws_api_gateway_domain_name.article_reader.domain_name
  type    = "A"
  zone_id = aws_route53_zone.main.zone_id

  alias {
    name                   = aws_api_gateway_domain_name.article_reader.regional_domain_name
    zone_id                = aws_api_gateway_domain_name.article_reader.regional_zone_id
    evaluate_target_health = false
  }
}

###############################################
# SNS Topic endpoint
###############################################

data "aws_region" "current" {} 
resource "aws_api_gateway_resource" "todoist" {
  path_part   = "todoist"
  parent_id   = aws_api_gateway_resource.api.id
  rest_api_id = aws_api_gateway_rest_api.article_reader.id
}

resource "aws_api_gateway_method" "todoist_post" {
  rest_api_id   = aws_api_gateway_rest_api.article_reader.id
  resource_id   = aws_api_gateway_resource.todoist.id
  http_method   = "GET"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "integration" {
  rest_api_id             = aws_api_gateway_rest_api.article_reader.id
  resource_id             = aws_api_gateway_resource.todoist.id
  http_method             = aws_api_gateway_method.todoist_post.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "arn:aws:apigateway:${data.aws_region.current}:sns:path//"

  request_parameters = {
    "integration.request.header.Content-Type" = "application/x-www-form-urlencoded"
  }

  request_templates = {
    "application/json" = "Action=Publish&TopicArn=$util.urlEncode('${aws_sns_topic.todoist_item_events.arn}')&Message=$util.urlEncode($input.body)"
  }
}

resource "aws_api_gateway_integration_response" "sns_integration_response" {
  rest_api_id = aws_api_gateway_rest_api.article_reader.id
  resource_id = aws_api_gateway_resource.todoist.id
  http_method = aws_api_gateway_method.todoist_post.http_method
  status_code = aws_api_gateway_method_response.response_200.status_code

  response_templates = {}
}

resource "aws_api_gateway_method_response" "response_200" {
  rest_api_id = aws_api_gateway_rest_api.article_reader.id
  resource_id = aws_api_gateway_resource.todoist.id
  http_method = aws_api_gateway_method.todoist_post.http_method
  status_code = "200"

  response_templates = {}
}
resource "aws_iam_role" "api_gw_role" {
  name = "api_gw_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "apigateway.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_policy" "api_gw_policy" {
  name        = "test-api_gw_policy"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "sns:Publish"
      ],
      "Effect": "Allow",
      "Resource": "${aws_sns_topic.todoist_item_events.arn}"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "api_gw" {
  role       = aws_iam_role.api_gw_role.name
  policy_arn = aws_iam_policy.api_gw_policy.arn
}
