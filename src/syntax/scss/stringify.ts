import { Node, Groot, TokenizedSymbol } from '@src/typings';

const groot: Groot = {
  arguments(node) {
    return `(${pulp(node)})`;
  },
  atkeyword(node) {
    return `@${pulp(node)}`;
  }
};

const pulp = (node: Node): string => {
  const nodeType = node.type as TokenizedSymbol;

  if (groot[nodeType] === undefined) {
    return '';
  }

  if (node.content === 'string') {
    return node.content;
  }

  if (Array.isArray(node.content)) {
    return flatten(node.content);
  }

  return '';
}

const flatten = (branches: Node[]): string => {
  return branches.reduce((acc, curr) => acc + pulp(curr), '');
}

export default (treeNode: Node) => pulp(treeNode);