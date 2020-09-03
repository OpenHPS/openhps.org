FROM jekyll/jekyll:latest
RUN   apk update \                                                                                                                                                                                                                        
  &&   apk add ca-certificates wget \                                                                                                                                                                                                      
  &&   update-ca-certificates    

ADD . /src/jekyll/
ENTRYPOINT ["/bin/bash", "/src/jekyll/_scripts/run.sh"]