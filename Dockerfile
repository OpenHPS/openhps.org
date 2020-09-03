FROM jekyll/jekyll:latest
ADD . /src/jekyll/
ENTRYPOINT ["/bin/bash", "/src/jekyll/_scripts/run.sh"]