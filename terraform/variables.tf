variable "tfstate_bucketname" {
  type    = string
  default = "expandedelements-terraform-state"
}

variable "article_extract_api_host" {
  type    = string
  default = "lexper.p.rapidapi.com"
}

variable "article_extract_api_key" {
  type = string
}

variable "article_table_name" {
  type    = string
  default = "article-reader"
}

variable "domain_name" {
  type    = string
  default = "jasonlehmer.com"
}
