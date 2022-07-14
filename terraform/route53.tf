resource "aws_route53_zone" "main" {
  name = var.domain_name
}

resource "aws_route53_record" "validation_record" {
  zone_id = aws_route53_zone.main.zone_id
  name    = aws_acm_certificate.article_reader_domain.domain_validation_options.0.resource_record_name
  type    = aws_acm_certificate.article_reader_domain.domain_validation_options.0.resource_record_type
  records = [aws_acm_certificate.article_reader_domain.domain_validation_options.0.resource_record_value]
  ttl     = 300
}
