// Projects.jsx

import React from "react";
import Layout from '../components/Layout';

const ProjectsPage = () => {
  const title = 'Projects | Abdulhaq Dimensions';
  const description = 'A selection of our recent projects and installations.';
  return (
    <Layout title={title} description={description}>
      <div>Projects go here</div>
    </Layout>
  );
};

export default ProjectsPage;
