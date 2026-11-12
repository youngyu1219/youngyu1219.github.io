# 于弋洋 · 个人主页

主页保留原模板的动效、版式和配图，正文从 `contents/` 读取 Markdown 格式的纯文本，页面配置从 YAML 格式的纯文本读取。无需 Python、数据库或后端。

## 修改内容

- `contents/home.txt`：个人介绍、教育背景、联系方式与技能
- `contents/awards.txt`：竞赛和荣誉
- `contents/experience.txt`：项目、校园工作与社会实践
- `contents/publications.txt`：论文与研究
- `contents/tools.txt`：工具与作品
- `contents/news.txt`：关于我页面的新闻
- `contents/config.txt`：网页标题、首屏文案和版权文字（YAML 格式）

编辑并保存对应文件后刷新页面即可更新内容。文件扩展名使用 `.txt` 是为了兼容当前 localhost:2222 预览服务对 `.md`/`.yml` 的访问限制；文件内容仍使用 Markdown 或 YAML 语法。

## 预览与发布

上传 `index.html`、`contents/`、`css/`、`js/` 和 `img/` 到 GitHub Pages 或其他静态网站托管服务。主页通过浏览器读取 Markdown 和 YAML；浏览器出于本地文件安全限制，双击 `index.html` 可能无法读取这些内容，因此请通过静态网站网址预览。全站无需 Python。
