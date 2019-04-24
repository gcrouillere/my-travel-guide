Cloudinary.config do |config|
  config.cloud_name = ENV['CLOUDNAME']
  config.api_key = ENV['CLOUDINARYAPIKEY']
  config.api_secret = ENV['CLOUDINARYAPISECRET']
  config.secure = true
  config.cdn_subdomain = true
end
