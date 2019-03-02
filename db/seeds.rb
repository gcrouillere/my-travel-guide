["Solo", "Couple", "Friends", "Family"].each { |s| AudienceSelection.create(audience: s)}

2.times do |i|
  a = Article.create(title: "Article #{i}", audience_selections: [AudienceSelection.first])
  b = TextContent.create(article: a, text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet quam nec mi aliquam varius. Morbi in varius metus, nec sollicitudin arcu. Nam commodo nisi erat, et rhoncus leo egestas vulputate. Phasellus pretium lacus a laoreet fringilla. Pellentesque ornare, dolor sed imperdiet ullamcorper, purus odio feugiat metus, id gravida nibh velit sed turpis. Vivamus eu condimentum odio. Curabitur vel dolor leo. Etiam ut ipsum rutrum, fermentum justo nec, lacinia lorem. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent a justo vulputate, lacinia tortor non, consectetur libero. Pellentesque magna mi, pulvinar non lobortis nec, rutrum at ipsum. Pellentesque lobortis enim hendrerit dui auctor fringilla. Vestibulum vitae lacinia leo, eu lacinia purus.

  Nulla facilisi. In tempus nec turpis a feugiat. Maecenas egestas varius massa, nec pretium ipsum consequat elementum. Vestibulum lacinia blandit augue sit amet suscipit. Etiam tempus viverra lectus, vitae egestas arcu imperdiet et. Nam pretium varius ligula, in egestas lacus convallis sed. Curabitur et pellentesque ante, non egestas mauris. Curabitur tristique urna eu augue maximus, ut venenatis lacus lacinia. In vestibulum vel arcu vehicula porta. Quisque et est interdum, iaculis ipsum quis, vulputate ante. Quisque consectetur mollis consectetur. Suspendisse condimentum feugiat semper. Ut laoreet ex magna. Nullam lobortis tellus eu euismod vestibulum. Mauris a dignissim ligula, at facilisis mi. Morbi suscipit leo in nibh cursus tempor.")
end


