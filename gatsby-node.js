
const path = require("path");

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions;

  const blogresult = await graphql(`
    query {
        allContentfulBlogPost(sort: {fields: publishDate, order: DESC}) {
          edges {
            node {
              id
              slug
            }
            next {
                title
                slug
            }
            previous {
                title
                slug
            }
          }
        }
        allContentfulCategory {
          edges {
            node {
              categorySlug
              id
              category
              blogpost{
                title
              }
            }
          }
        }
      }
    `)
  if (blogresult.errors) {
    reporter.panicOnBuild(`GraphQLのクエリでエラーが発生しました`)
    return
  }

  blogresult.data.allContentfulBlogPost.edges.forEach(({ node, next, previous }) => {
    createPage({
      path: `/blog/post/${node.slug}/`,
      component: path.resolve(`./src/templates/blogpost-template.jsx`),
      context: {
        id: node.id,
        next,
        previous,
      },
    })
  })

  const blogPostPerPage = 6;
  const blogPosts = blogresult.data.allContentfulBlogPost.edges.length;
  const blogPages = Math.ceil(blogPosts / blogPostPerPage);

  Array.from({ length: blogPages }).forEach((_, i) => {
    createPage({
      path: i === 0 ? `/blog/` : `/blog/${i + 1}/`,
      component: path.resolve("./src/templates/blog-template.jsx"),
      context: {
        skip: blogPostPerPage * i,
        limit: blogPostPerPage,
        currentPage: i + 1,
        isFirst: i + 1 === 1,
        isLast: i + 1 === blogPages,
      },
    })
  })

  blogresult.data.allContentfulCategory.edges.forEach(({ node }) => {
    const catPostsPerPage = 6;
    const catPosts = node.blogposst.length;
    const catPages = Math.ceil(catPosts / catPostsPerPage);

    Array.from({ length: catPages }).forEach((_, i) => {
      createPage({
        path: i === 0 ? `/category/${node.categorySlug}/` : `/category/${node.categorySlug}/${i + 1}/`,
        component: path.resolve(`./src/templates/category-template.jsx`),
        context: {
          categoryid: node.id,
          categoryname: node.category,
          categoryslug: node.categorySlug,
          skip: catPostsPerPage,
          limit: catPostsPerPage,
          currentPage: i + 1,
          isFirst: i + 1 === 1,
          isLast: i + 1 === catPages,
        },
      })
    })
  })

}
