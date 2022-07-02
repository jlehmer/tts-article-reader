terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.0"
    }
  }

  backend "s3" {
    bucket         = "expandedelements-terraform-state"
    dynamodb_table = "terraform-state-lock"
    encrypt        = true
    key            = "tts-article-reader"
    region         = "us-east-2"
  }
}

provider "aws" {
  region = "us-east-2"
}
