resource "aws_apigatewayv2_api" "article_reader" {
  name          = "article-reader-gateway"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_domain_name" "article_reader" {
  domain_name = "article-reader.jasonlehmer.com"

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.article_reader_domain.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_route53_record" "article_reader" {
  name    = aws_apigatewayv2_domain_name.article_reader.domain_name
  type    = "A"
  zone_id = aws_route53_zone.main.zone_id

  alias {
    name                   = aws_apigatewayv2_domain_name.article_reader.domain_name_configuration[0].target_domain_name
    zone_id                = aws_apigatewayv2_domain_name.article_reader.domain_name_configuration[0].hosted_zone_id
    evaluate_target_health = false
  }
}

