const gql = require('graphql-tag'),
	{ buildSchema } = require('graphql');



const getGqlString = (doc) => {
  return doc.loc && doc.loc.source.body;
}



const schema = gql`
# Our main todo type
type Query {
  # Get one todo item
	# topics: [Topic]
	# test: Test
	t: String
}
# type Topic {
#   content: TContent!
# 	revisions: [Revision]!
# }

# type Test {
# 	title: String
# }
# type Revision {
# 	id: ID!
# 	author: String!
# 	content: String
# 	# appearsIn: Topics!
# }

# type TContent {
# 	id: ID!
# 	private: Boolean
# 	creator: String!
# 	title: String!
# 	order: Order
# 	appearsIn: Topics!
# }

# type Order {
# 	comments:[Comment]
# 	sections: [Section]
# }
# type Section {
# 	id: ID!
# 	comments: [Comment]
# 	children: [ID]
# }

# type Comment {
# 	id: ID!
# 	children: [ID]
# }

`;


// {
//   topics {
//     content {
//       id
//       private
//       creator
//       title
//       order {
//         comments {
//           id
//           children
//         }
//         sections {
//           id
//           comments {
//             id
//             children
//           }
//           children
//         }
//       }
//     }
//     revisions {
//       id
//       author
//       content
//     }
//   }
// }

module.exports = buildSchema(getGqlString(schema));