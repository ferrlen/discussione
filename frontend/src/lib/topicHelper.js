import util from "@/lib/util.js";

export default (() => ({
  buildTopicTree: (data) => {
    const unsortedInfos = util.clone(data.infos);
    const tree = [];
    const topLevel = data.order;

    const getInfo = (id) => {
      const infoKeys = Object.keys(unsortedInfos);
      let node = {};
      for (let i = 0; i < infoKeys.length; i++) {
        if (infoKeys[i] === id) {
          const currrentNodeData = unsortedInfos[infoKeys[i]];
          node = {
            author: currrentNodeData.author,
            content: currrentNodeData.content,
            id: currrentNodeData.id,
            branches: [],
          };
          delete unsortedInfos[infoKeys[i]];
        }
      }
      return node;
    };
    const descendTree = (branch) => {
      const node = getInfo(branch.id);
      if (util.hasProp(branch, "sections"))
        for (let i = 0; i < branch.sections.length; i++) {
          const offshoot = branch.sections[i];
          if (offshoot.sections.length) {
            node.branches.push(descendTree(offshoot));
          } else {
            node.branches.push(getInfo(offshoot.id));
          }
        }
      return node;
    };

    for (let i = 0; i < topLevel.sections.length; i++) {
      tree.push(descendTree(topLevel.sections[i]));
    }

    return tree;
  },
}))();
