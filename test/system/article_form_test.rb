require "application_system_test_case"

class ArticleFormTest < ApplicationSystemTestCase

  test 'article form displays accordingly' do
    load_article

    assert_selector ".audienceSelection.complete", count: 1
    assert_selector ".sectionLabel", text: "For whom is the trip intended ?"
    assert_selector ".mainTitleSub", text: "(select all that apply)"
    assert_selector ".form-check-label.ticked", count: 1
    assert_selector ".form-check-label.blank", count: 1

    assert_selector ".sectionLabel", text: "Article title"
    assert_selector ".maintTitle input[value='Article one']", count: 1

    assert_selector "#contentMenu .expand p", count: 4
    assert_selector "#contentMenu .expand p", text: "M"

    assert_selector ".sectionLabel", text: "Article content"

    assert_selector ".articleContent #content-0.photoInput[draggable=true]", count: 1
    img1_src = 'https://res.cloudinary.com/dbhsa0hgf/image/upload/v1550478209/iupxak0bo3npl43vwptt.jpg'
    assert_selector "#content-0 .photoContainer img[src='#{img1_src}']", count: 1

    assert_selector ".articleContent #content-1.mapInput[draggable=true]", count: 1
    assert_selector "#content-1.mapInput .mapLocationInput[value='map 1']", count: 1
    assert_selector "#content-1.mapInput .googleMap", count: 1
    assert find("#content-1.mapInput .googleMap img[src*='place-black']")
    assert find("#content-1.mapInput .googleMap img[src*='restaurant-black']")

    assert_selector ".articleContent #content-2.photoInput[draggable=true]", count: 1
    img2_src = 'https://res.cloudinary.com/dbhsa0hgf/image/upload/v1543409831/lrt4uzxmcvevfohzaipd.jpg'
    assert_selector "#content-2 .photoContainer img[src='#{img2_src}']", count: 1

    assert_selector ".articleContent #content-3.textContentInput[draggable=true]", count: 1
    assert_selector "#content-3.textContentInput .ql-editor h2", text: "Awesome content"
    assert_selector "#content-3.textContentInput .ql-editor p", text: "Truly great"
  end

  test 'displays content menu and add new textblock' do
    load_article

    find("#contentMenu .menu").click

    assert_selector ".contentMenu .buttons .blocAddition.text", count: 1
    assert_selector ".contentMenu .buttons .blocAddition.map", count: 1
    assert_selector ".contentMenu .buttons .blocAddition.photo", count: 1

    find("#contentMenu .buttons .blocAddition.text").click
    sleep 0.1.seconds
    assert_selector ".articleContent #content-4.textContentInput[draggable=true]", count: 1
    assert_selector "#content-4.textContentInput .ql-editor p", count: 1
  end

  test 'displays content menu, add new textblock and delete it' do
    load_article

    find("#contentMenu .menu").click

    assert_selector ".contentMenu .buttons .blocAddition.text", count: 1
    assert_selector ".contentMenu .buttons .blocAddition.map", count: 1
    assert_selector ".contentMenu .buttons .blocAddition.photo", count: 1

    find("#contentMenu .buttons .blocAddition.text").click
    sleep 0.1.seconds
    assert_selector ".articleContent #content-4.textContentInput[draggable=true]", count: 1
    assert_selector "#content-4.textContentInput .ql-editor p", count: 1

    find("#content-4.textContentInput").hover
    find("#content-4 .contentDelete").click
    sleep 0.1.seconds

    assert_selector ".articleContent #content-4.textContentInput[draggable=true]", count: 0
  end

  test 'drags element to appropriate position' do
    load_article

    element = find("#content-3")
    target = find("#content-0")

    element.drag_to target
    sleep 0.1.seconds

    assert_selector ".articleContent #content-0.textContentInput[draggable=true]", count: 1
    assert_selector ".articleContent #content-1.photoInput[draggable=true]", count: 1
  end

  test 'create element in appropriate position after dragging' do
    load_article

    target = find("#content-1")
    find("#contentMenu .menu").click
    sleep 0.1.seconds
    find("#contentMenu .buttons .blocAddition.text").drag_to target
    sleep 0.1.seconds

    assert_selector ".articleContent #content-2.textContentInput[draggable=true]", count: 1
  end

  test 'add a marker on map' do
    load_article

    assert_selector ".googleMap img[src*=place-black]", count: 1

    find("#content-1.mapInput").hover
    find("#content-1.mapInput .tuneLogo").click
    find("#content-1.mapInput #marker").click
    find("#content-1.mapInput .googleMap").click

    assert_selector ".googleMap img[src*=place-black]", count: 2
  end

end
