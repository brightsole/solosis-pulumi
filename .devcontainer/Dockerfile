# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.163.1/containers/javascript-node/.devcontainer/base.Dockerfile
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:14

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends fortune fortunes cowsay fonts-firacode fonts-powerline zsh vim

RUN curl -fsSL https://get.pulumi.com | sh \
    && chown node:node -R /root/.pulumi/bin \
    && cp -a /root/.pulumi/bin/. /usr/local/bin/

USER node

ENV PATH="/usr/games:${PATH}"

RUN git clone --recursive https://github.com/sorin-ionescu/prezto.git "${ZDOTDIR:-$HOME}/.zprezto"
RUN git clone --depth=1 https://github.com/romkatv/powerlevel10k.git ~/powerlevel10k

RUN npm i -g lolcatjs zx np npm-check git-open

CMD [ "/bin/zsh" ]