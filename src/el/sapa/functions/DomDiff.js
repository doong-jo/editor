const setBooleanProp = (el, name, value) => {
    if (value) {
        el.setAttribute(name, name);
        el[name] = value;
    } else {
        el.removeAttribute(name);
        el[name] = value;
    }
  };
  
const setProp = (el, name, value) => {
    if (typeof value === 'boolean') {
        setBooleanProp(el, name, value);
    } else {
        el.setAttribute(name, value);
    }
};


const removeBooleanProp = (node, name) => {
    node.removeAttribute(name);
    node[name] = false;
};

const removeUndefinedProp = (node, name) => {
    node.removeAttribute(name);
}
  
const removeProp = (node, name, value) => {
    if (typeof value === 'boolean') {
        removeBooleanProp(node, name);
    } else if (name) {
        removeUndefinedProp(node, name);
    }
};
  

const updateProp = (node, name, newValue, oldValue) => {
    if (!newValue) {
      removeProp(node, name, oldValue);
    } else if (!oldValue || newValue !== oldValue) {
      setProp(node, name, newValue);
    }
  };


const updateProps = (node, newProps = {}, oldProps = {}) => {

    const keyList = [];
    keyList.push.apply(keyList, Object.keys(newProps))
    keyList.push.apply(keyList, Object.keys(oldProps))

    const props = new Set(keyList)

    props.forEach(key => {
        updateProp(node, key, newProps[key], oldProps[key])
    })
};

/**
 * TEXT_NODE 일 때   둘 다 공백일 때는  비교하지 않는다. 
 * 
 * @param {*} node1 
 * 
 * @param {*} node2 
 */
function changed(node1, node2) {
    return (
        (node1.nodeType === Node.TEXT_NODE && node1.textContent !== node2.textContent) 
        || node1.nodeName !== node2.nodeName
    ) 
}

function hasPassed(node1) {
    return (
        (node1.nodeType !== Node.TEXT_NODE && node1.getAttribute('data-domdiff-pass') === 'true') 
    ) 
}

/**
 * refClass 속성을 가지고 있으면 기존 el 을 대체한다. 
 * 
 */ 
function hasRefClass(node1) {
    return (
        (node1.nodeType !== Node.TEXT_NODE && (node1.getAttribute('refClass'))) 
    ) 
}

function getProps (attributes) {
    var results = {}
    const len = attributes.length;
    for(let i = 0; i < len; i++) {
        const t = attributes[i];
        results[t.name] = t.value;        
    }

    return results;
    
}

function updateElement (parentElement, oldEl, newEl, i) {

    if (!oldEl) {
        // console.log('replace');        
        parentElement.appendChild(newEl.cloneNode(true));
    } else if (!newEl) {
        // console.log('replace');        
        parentElement.removeChild(oldEl);
    } else if (hasPassed(oldEl) || hasPassed(newEl)) {
        // NOOP
        // data-domdiff-pass="true" 일 때는 아무것도 비교하지 않고 끝낸다. 
        // console.log(oldEl, newEl, 'passed');
    } else if (changed(newEl, oldEl) || hasRefClass(newEl)) {
        // node 가 같지 않으면 바꾸고, refClass 속성이 있으면 바꾸고
        parentElement.replaceChild(newEl.cloneNode(true), oldEl);
    } else if (
        newEl.nodeType !== Node.TEXT_NODE 

        && newEl.nodeType !== Node.COMMENT_NODE
        && newEl.toString() !== "[object HTMLUnknownElement]"
    ) {
        // console.log(newEl);
        updateProps(oldEl, getProps(newEl.attributes), getProps(oldEl.attributes)); // added        
        var oldChildren = children(oldEl);
        var newChildren = children(newEl);
        var max = Math.max(oldChildren.length, newChildren.length);

        for (var i = 0; i < max; i++) {
            updateElement(oldEl, oldChildren[i], newChildren[i], i);
        }
    }

}

const children = (el) => {
    var element = el.firstChild; 

    if (!element) {
        return [] 
    }

    var results = [] 

    do {
        results.push(element);
        element = element.nextSibling;
    } while (element);

    return results; 
}


export function DomDiff (A, B) {

    A = A.el || A; 
    B = B.el || B; 

    var childrenA = children(A);
    var childrenB = children(B); 

    var len = Math.max(childrenA.length, childrenB.length);
    for (var i = 0; i < len; i++) {
        updateElement(A, childrenA[i], childrenB[i], i);
    }
}
