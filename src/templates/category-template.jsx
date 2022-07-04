import * as React from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import Layout from "../components/layout";
import Seo from "../components/seo";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronRight,
    faChevronLeft,
} from "@fortawesome/free-solid-svg-icons"


const Blog = (props, location, pageContext) => {
    return (
        <Layout>
            <Seo
                pagetitle={`CATEGORY: ${props.pageContext.categoryname}`}
                pagedesc={`「${props.pageContext.categoryname}」カテゴリーの記事です`}
                pagepath={props.location.pathname}
            />
            <section className="content bloglist">
                <div className="container">
                    <h1 className="bar">Category: {props.pageContext.categoryname}</h1>

                    <div className="posts">
                        {props.data.allContentfulBlogPost.edges.map(({ node }) => (
                            <article className="post" key={node.id}>
                                <Link to={`/blog/post/${node.slug}/`}>
                                    <figure>
                                        <GatsbyImage image={node.eyecatch.gatsbyImageData} alt={node.eyecatch.description} style={{ height: "100%" }} />
                                    </figure>
                                    <h3>{node.title}</h3>
                                </Link>
                            </article>
                        ))}
                    </div>
                    <ul className="pagenation">
                        {!props.pageContext.isFirst && (
                            <li className="prev">
                                <Link to={
                                    props.pageContext.currentPage === 2
                                        ? `/category/${props.pageContext.categoryslug}`
                                        : `/category/${props.pageContext.categoryslug}/${props.pageContext.currentPage - 1}`
                                }
                                    rel="prev"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                    <span>前のページ</span>
                                </Link>
                            </li>
                        )}
                        {props.pageContext.isLast && (
                            <li className="next">
                                <Link to=
                                    {`/category/${props.pageContext.categoryslug}/${props.pageContext.currentPage + 1}/`} rel="next" >
                                    <span>次のページ</span>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </section>
        </Layout>
    );
}

export const query = graphql`
query($categoryid: String!,$skip: Int!,$limit: Int!) {
    allContentfulBlogPost(
        sort: {fields: publishDate, order: DESC}
        skip: $skip
        limit: $limit
        filter: {category: {elemMatch: {id: {eq: $categoryid}}}}
        ) {
      edges {
        node {
          title
          slug
          id
          eyecatch {
            gatsbyImageData(width: 500, layout: CONSTRAINED)
            description
          }
        }
      }
    }
  }
  
`;

export default Blog;