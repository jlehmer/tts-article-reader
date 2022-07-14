resource "aws_route53_zone" "main" {
  name = var.domain_name
}

resource "aws_route53_record" "article_reader" {
  for_each = {
    for dvo in aws_acm_certificate.article_reader_domain.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = aws_route53_zone.main.zone_id
}
