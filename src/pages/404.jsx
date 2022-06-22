import * as React from "react";
import Layout from "../components/layout";
import Seo from "../components/seo";

const Unexpected = () => {
    return (
        <Layout>
            <Seo pagetitle="ページが見つかりません" />
            <h1 style={{padding : "20vh 0" , textAlign : "center"}} >お探しのページは見つかりませんでした！！</h1>
        </Layout>
    );
};

export default Unexpected;