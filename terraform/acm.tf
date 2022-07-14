resource "aws_acm_certificate" "article_reader_domain" {
  domain_name               = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}"]
  validation_method         = "DNS"

  tags = {
    Name : var.domain_name
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "article_reader_domain" {
  certificate_arn         = aws_acm_certificate.article_reader_domain.arn
  validation_record_fqdns = [aws_route53_record.article_reader.fqdn]
}
