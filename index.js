const express = require('express');
const minifyHTML = require('express-minify-html');
const dotenv = require('dotenv')

const { readDataFromJson } = require('./helpers/json/dataReader')
const experiences = readDataFromJson('./json/resume/experiences.json')
const projectsResume = readDataFromJson('./json/resume/projects.json')
const projectsIndex = readDataFromJson('./json/index/projects.json')

const profilePicture = readDataFromJson('./json/index/profile-picture.json')
const picture = readDataFromJson('./json/resume/picture.json')

const skills = readDataFromJson('./json/resume/skills.json')
const logo = readDataFromJson('./json/resume/logo.json')
const about = readDataFromJson('./json/index/about.json')
const blogs = require('./json/blogs');

const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}));

dotenv.config();
const PORT = process.env['PORT'] || 8080;

app.get('/', function (_, res) {
  const sections = {
    profile_picture: profilePicture,
    logo,
    about,
    projects: projectsIndex,
    blogs: Object.values(blogs)

  }
  console.log(sections)
  res.render('pages/index', { sections });
});

app.get('/resume', function (_, res) {
  const sections = {
    picture,
    experiences,
    projects: projectsResume,
    skills,
    logo,
    blogs: Object.values(blogs)

  }
  console.log(sections)
  res.render('pages/resume', { sections });
});

app.get('/blog/:slug', function (req, res) {
  const {slug} = req.params
  if (!blogs[slug]) {
    res.status(404)
    res.send('NOT FOUND')
    return
  }
  const sections = {
    blog: blogs[slug],
    logo,
    blogs: Object.values(blogs)
  }
  console.log(sections)
  res.render('pages/blog', { sections });
});


app.listen(PORT, function() {
    console.log('url: http://localhost:'+PORT);
});