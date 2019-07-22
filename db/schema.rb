# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_07_17_114940) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "article_audience_selections", force: :cascade do |t|
    t.bigint "article_id"
    t.bigint "audience_selection_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id"], name: "index_article_audience_selections_on_article_id"
    t.index ["audience_selection_id"], name: "index_article_audience_selections_on_audience_selection_id"
  end

  create_table "articles", force: :cascade do |t|
    t.string "title"
    t.boolean "audience_valid"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id"
    t.boolean "article_valid", default: false
    t.index ["user_id"], name: "index_articles_on_user_id"
  end

  create_table "audience_selections", force: :cascade do |t|
    t.string "audience"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "double_contents", force: :cascade do |t|
    t.integer "position"
    t.integer "height", default: 300
    t.bigint "article_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id"], name: "index_double_contents_on_article_id"
  end

  create_table "maps", force: :cascade do |t|
    t.integer "zoom"
    t.string "name"
    t.float "lat"
    t.float "lng"
    t.integer "position"
    t.integer "height"
    t.boolean "show_map_center_as_marker"
    t.bigint "article_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "double_content_id"
    t.index ["article_id"], name: "index_maps_on_article_id"
    t.index ["double_content_id"], name: "index_maps_on_double_content_id"
  end

  create_table "markers", force: :cascade do |t|
    t.float "lat"
    t.float "lng"
    t.text "description"
    t.string "logo"
    t.integer "position"
    t.bigint "map_id"
    t.bigint "polyline_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["map_id"], name: "index_markers_on_map_id"
    t.index ["polyline_id"], name: "index_markers_on_polyline_id"
  end

  create_table "photos", force: :cascade do |t|
    t.integer "position"
    t.string "public_id"
    t.string "version"
    t.string "signature"
    t.integer "original_width"
    t.integer "original_height"
    t.integer "width"
    t.integer "height"
    t.integer "css_width", default: 80
    t.string "css_height", default: "auto"
    t.integer "bytes"
    t.string "format"
    t.string "resource_type"
    t.string "url"
    t.string "cropped_url"
    t.string "original_filename"
    t.boolean "display_title"
    t.bigint "article_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "double_content_id"
    t.index ["article_id"], name: "index_photos_on_article_id"
    t.index ["double_content_id"], name: "index_photos_on_double_content_id"
  end

  create_table "polylines", force: :cascade do |t|
    t.boolean "distance_displayed"
    t.bigint "map_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["map_id"], name: "index_polylines_on_map_id"
  end

  create_table "text_contents", force: :cascade do |t|
    t.text "text"
    t.integer "position"
    t.bigint "article_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "double_content_id"
    t.index ["article_id"], name: "index_text_contents_on_article_id"
    t.index ["double_content_id"], name: "index_text_contents_on_double_content_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "article_audience_selections", "articles"
  add_foreign_key "article_audience_selections", "audience_selections"
  add_foreign_key "articles", "users"
  add_foreign_key "double_contents", "articles"
  add_foreign_key "maps", "articles"
  add_foreign_key "maps", "double_contents"
  add_foreign_key "markers", "maps"
  add_foreign_key "markers", "polylines"
  add_foreign_key "photos", "articles"
  add_foreign_key "photos", "double_contents"
  add_foreign_key "polylines", "maps"
  add_foreign_key "text_contents", "articles"
  add_foreign_key "text_contents", "double_contents"
end
