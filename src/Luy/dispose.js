import { typeNumber } from './utils'
import { clearRefs } from './Refs'
import { clearEvents } from './mapProps';

export function disposeVnode(Vnode) {//主要用于删除Vnode对应的节点
    const { type, props } = Vnode
    if (!type) return
    // clearEvents(Vnode._hostNode, props, Vnode);
    if (typeof Vnode.type === 'function') {
        if (Vnode._instance.componentWillUnMount) {
            Vnode._instance.componentWillUnMount()
        }

        clearRefs(Vnode._instance.ref)
    }
    if (Vnode.props.children) {
        disposeChildVnode(Vnode.props.children)
    }
    if (Vnode._PortalHostNode) {
        const parent = Vnode._PortalHostNode.parentNode
        parent.removeChild(Vnode._PortalHostNode)
    } else {
        if (Vnode._hostNode) {//有可能会出现undefind的情况
            const parent = Vnode._hostNode.parentNode
            if (parent)
                parent.removeChild(Vnode._hostNode)
        }
    }
    Vnode._hostNode = null
}

function disposeChildVnode(childVnode) {
    let children = childVnode
    if (typeNumber(children) !== 7) children = [children]
    children.forEach((child) => {
        if (typeof child.type === 'function') {
            if (child._instance.componentWillUnMount) {
                child._instance.componentWillUnMount()
            }
        }
        if (typeNumber(child) !== 4 && typeNumber(child) !== 3 && child._hostNode !== void 666) {
            // clearEvents(child._hostNode, child.props, child);
            const parent = child._hostNode.parentNode
            parent.removeChild(child._hostNode)
            child._hostNode = null
            child._instance = null
            if (child.props.children) {
                disposeChildVnode(child.props.children)
            }
        }
    })
}