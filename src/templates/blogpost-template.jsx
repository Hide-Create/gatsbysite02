
import * as React from "react";
import { graphql, Link } from "gatsby";
import { GatsbyImage } from "gatsby-plugin-image";
import Layout from "../components/layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faFolderOpen } from "@fortawesome/free-regular-svg-icons";
import { faChevronLeft, faChevronRight, faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { renderRichText } from "gatsby-source-contentful/rich-text";
import { BLOCKS } from "@contentful/rich-text-types";
import { documentToPlainTextString } from "@contentful/rich-text-plain-text-renderer";
import SEO from "../components/seo";

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

const Blogpost = (props, pageContext, location) => {
    return (
        <Layout>
            <SEO 
            pagetitle={props.data.contentfulBlogPost.title} 
            pagedesc={`${documentToPlainTextString(JSON.parse(props.data.contentfulBlogPost.content.raw)).slice(0, 70)}...`}
            pagepath={props.location.pathname}
            blogimg={`https:${props.data.contentfulBlogPost.eyecatch.url}`}
            pageimgw={props.data.contentfulBlogPost.eyecatch.file.details.image.width}
            pageimgh={props.data.contentfulBlogPost.eyecatch.file.details.image.height}
             />
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
                                        <Link to={`/cat/${cat.categorySlug}/`} >{cat.category}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </aside>

                    <div className="postbody">
                        {renderRichText(props.data.contentfulBlogPost.content, options)}
                    </div>

                    <ul className="postlink">
                        {props.pageContext.next && (
                            <li className="prev">
                                <Link to={`/blog/post/${props.pageContext.next.slug}/`} rel="prev" >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                    <span>{props.pageContext.next.title}</span>
                                </Link>
                            </li>
                        )}
                        {props.pageContext.previous && (
                            <li className="next">
                                <Link to={`/blog/post/${props.pageContext.previous.slug}`} rel="next" >
                                    <span>{props.pageContext.previous.title}</span>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </Link>
                            </li>
                        )}
                    </ul>

                </div>
            </article>
        </Layout>
    );
};

export const query = graphql`
query($id: String!) {
    contentfulBlogPost(id: {eq: $id}) {
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