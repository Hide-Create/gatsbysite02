import * as React from "react";
import { graphql } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import Layout from "../components/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft, faChevronRight, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { renderRichText } from "gatsby-source-contentful/rich-text";
import { BLOCKS } from "@contentful/rich-text-types";

const options = {
    renderNode: {
        [BLOCKS.HEADING_2]: (node, children) => (
            <h2>
                <FontAwesomeIcon icon={faCheckSquare} />
                {children}
            </h2>
        ),
        [BLOCKS.EMBEDDED_ASSET]: node => (
            <GatsbyImage
                image={node.data.target.gatsbyImageData}
                alt={node.data.target.description ? node.data.target.description : node.data.target.title}
            />
        ),
    },
    renderText: text => {
        return text.split('\n').reduce((children, textSegment, index) => {
            return [...children, index > 0 && <br key={index} />, textSegment];
        }, []);
    },
}

const Blogpost = (props) => {
    console.log(props.data.contentfulBlogPost.category);
    return (
        <Layout>
            <div className="eyecatch">
                <figure>
                    <GatsbyImage image={props.data.contentfulBlogPost.eyecatch.gatsbyImageData} alt={props.data.contentfulBlogPost.eyecatch.description} />
                </figure>
            </div>

            <article className="content">
                <div className="container">
                    <h1 className="bar">{props.data.contentfulBlogPost.title}</h1>

                    <aside className="info">
                        <time dateTime={props.data.contentfulBlogPost.publishDate}><FontAwesomeIcon icon={faClock} />{props.data.contentfulBlogPost.publishDateJP}</time>

                        <div className="cat">
                            <FontAwesomeIcon icon={faFolderOpen} />
                            <ul>
                                {props.data.contentfulBlogPost.category.map(cat => (
                                    <li className={cat.categorySlug} key={cat.id} >
                                        {cat.category}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    <div className="postbody">
                        {renderRichText(props.data.contentfulBlogPost.content, options)}
                    </div>

                    <ul className="postlink">
                        <li className="prev">
                            <a href="base-blogpost.html" rel="prev">
                                <FontAwesomeIcon icon={faChevronLeft} />
                                <span>前の記事</span>
                            </a>
                        </li>
                        <li className="next">
                            <a href="base-blogpost.html" rel="next">
                                <span>次の記事</span>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </a>
                        </li>
                    </ul>

                </div>
            </article>
        </Layout>
    );
};

export const query = graphql`
query {
    contentfulBlogPost {
      title
      publishDateJP:publishDate(formatString: "YYYY-MM-DD")
      publishDate
      category {
        category
        categorySlug
        id
      }
      eyecatch {
        gatsbyImageData(layout: FULL_WIDTH)
        description
        file {
          details {
            image {
              height
              width
            }
          }
        }
        url
      }
      content{
        raw
        references {
            ... on ContentfulAsset {
            contentful_id
            __typename
            gatsbyImageData(layout: FULL_WIDTH)
            title
            description
            }
          }
      }
    }
  }
`;

export default Blogpost;