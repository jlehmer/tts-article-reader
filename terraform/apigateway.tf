resource "aws_apigatewayv2_api" "article_reader" {
  name          = "article-reader-gateway"
  protocol_type = "HTTP"
}
