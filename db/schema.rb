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

ActiveRecord::Schema.define(version: 2019_03_04_084417) do

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
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "audience_selections", force: :cascade do |t|
    t.string "audience"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "maps", force: :cascade do |t|
    t.integer "zoom"
    t.string "name"
    t.float "lat"
    t.float "lng"
    t.integer "position"
    t.integer "height"
    t.bigint "article_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id"], name: "index_maps_on_article_id"
  end

  create_table "markers", force: :cascade do |t|
    t.float "lat"
    t.float "lng"
    t.text "description"
    t.bigint "map_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["map_id"], name: "index_markers_on_map_id"
  end

  create_table "text_contents", force: :cascade do |t|
    t.text "text"
    t.integer "position"
    t.bigint "article_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["article_id"], name: "index_text_contents_on_article_id"
  end

  add_foreign_key "article_audience_selections", "articles"
  add_foreign_key "article_audience_selections", "audience_selections"
  add_foreign_key "maps", "articles"
  add_foreign_key "markers", "maps"
  add_foreign_key "text_contents", "articles"
end
