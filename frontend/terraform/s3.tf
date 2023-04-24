data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "spa" {
  bucket = "todo-app-${data.aws_caller_identity.current.account_id}"
  tags = {
    Name = "Todo App"
  }
}

resource "aws_s3_bucket_website_configuration" "spa" {
  bucket = aws_s3_bucket.spa.id

  index_document {
    suffix = "index.html"
  }
}

resource "aws_s3_bucket_policy" "spa" {
  bucket = aws_s3_bucket.spa.id
  policy = jsonencode({
    "Version" : "2012-10-17",
    "Statement" : [
      {
        "Sid" : "PublicReadGetObject",
        "Effect" : "Allow",
        "Principal" : "*",
        "Action" : "s3:*",
        "Resource" : "arn:aws:s3:::${aws_s3_bucket.spa.id}/*"
      }
    ]
  })
}


resource "aws_s3_object" "spa" {
  for_each = fileset("${path.module}/out", "**/*.*")

  bucket = aws_s3_bucket.spa.id
  key    = each.value
  source = "${path.module}/out/${each.value}"
  etag   = filemd5("${path.module}/out/${each.value}")
}
