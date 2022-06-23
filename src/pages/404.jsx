import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";

const Unexpected = (props, location) => {
    return (
        <Layout>
            <Seo pagetitle="ページが見つかりません" pagepath={props.location.pathname} />
            <h1 style={{padding : "20vh 0" , textAlign : "center"}} >お探しのページは見つかりませんでした！！</h1>
        </Layout>
    );
};

export default Unexpected;