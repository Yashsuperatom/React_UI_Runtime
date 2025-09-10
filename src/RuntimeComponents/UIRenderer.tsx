// import React from 'react'
// interface UIRendererProps {
//     schema: any
//     data?: any
//     handlers?: Record<string, Function>
//     isStreaming?: boolean
//     onRefresh?: () => void
// }

// /**
//  * Replace {{path.to.value}} in strings with actual values from `data`
//  */
// const resolveDataBinding = (text: string, data: any): string => {
//     if (!text || typeof text !== 'string' || !data) return text

//     const bindingRegex = /\{\{([^}]+)\}\}/g
//     return text.replace(bindingRegex, (match, path) => {
//         try {
//             const value = path.split('.').reduce((cur: any, key: string) => {
//                 if (cur === null || cur === undefined) return ''
//                 if (!isNaN(Number(key))) {
//                     const index = parseInt(key, 10)
//                     return Array.isArray(cur) ? cur[index] : cur
//                 }
//                 return cur[key]
//             }, data)
//             return value !== undefined && value !== null ? String(value) : ''
//         } catch {
//             return match
//         }
//     })
// }


// const UIRenderer = ({ schema, data, handlers = {} , onRefresh }: UIRendererProps) => {
//     const renderComponent = (
//         component: any,
//         contextData: any = data,
//         key?: number | string,
//     ): React.ReactNode => {
//         // Handle text node
//         if (typeof component === 'string') {
//             return resolveDataBinding(component, contextData)
//         }

//         if (!component || typeof component !== 'object') return null

//         const { id, type, props = {}, children = [], binding, dataPath } = component

//         if (!type || typeof type !== 'string') {
//             console.warn('Component missing type:', component)
//             return null
//         }

//         const normalizedType = type.toLowerCase().trim()

//         // ✅ Only allow safe HTML tags
//         const validHtmlTags = new Set([
//             'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
//             'button', 'input', 'textarea', 'select', 'option', 'label',
//             'form', 'fieldset', 'legend', 'img', 'a', 'ul', 'ol', 'li',
//             'table', 'thead', 'tbody', 'tr', 'td', 'th', 'nav', 'header',
//             'footer', 'main', 'section', 'article', 'aside', 'br', 'hr',
//             'strong', 'em', 'small', 'code', 'pre', 'blockquote', 'cite',
//             'canvas', 'svg', 'video', 'audio', 'iframe', 'embed', 'object',
//             'iconify-icon'
//         ])

//         if (!validHtmlTags.has(normalizedType)) {
//             console.warn('Invalid HTML tag:', normalizedType)
//             return null
//         }

//         try {
//             // Get the appropriate data context
//             let currentData = contextData

//             // If component has dataPath, navigate to that data
//             if (dataPath && contextData) {
//                 currentData = dataPath.split('.').reduce((cur: any, key: string) => cur?.[key], contextData)
//             }

//             // Process props with data binding
//             const processedProps: any = { ...props }
//             Object.keys(processedProps).forEach(propKey => {
//                 if (typeof processedProps[propKey] === 'string') {
//                     processedProps[propKey] = resolveDataBinding(processedProps[propKey], currentData)
//                 }
//             })

//             // Hook up handlers
//             if (processedProps.onClick && typeof processedProps.onClick === 'string') {
//                 const fn = handlers[processedProps.onClick]
//                 processedProps.onClick = typeof fn === 'function'
//                     ? fn
//                     : () => console.warn(`Missing handler: ${processedProps.onClick}`)
//             }

//             // Add key for React reconciliation
//             if (key !== undefined) processedProps.key = key

//             // Handle children rendering
//             let renderedChildren: React.ReactNode[] = []

//             // 🔥 NEW: Handle binding on this component
//             if (binding && currentData && currentData[binding]) {
//                 const boundData = currentData[binding]

//                 if (Array.isArray(boundData)) {
//                     // For each item in the bound array, render all children with that item as context
//                     boundData.forEach((item, index) => {
//                         children.forEach((child: any, childIndex: number) => {
//                             const childKey = `${binding}-${index}-${childIndex}`
//                             const renderedChild = renderComponent(child, item, childKey)
//                             if (renderedChild) {
//                                 renderedChildren.push(renderedChild)
//                             }
//                         })
//                     })
//                 } else {
//                     // Single object binding
//                     children.forEach((child: any, childIndex: number) => {
//                         const childKey = `${binding}-${childIndex}`
//                         const renderedChild = renderComponent(child, boundData, childKey)
//                         if (renderedChild) {
//                             renderedChildren.push(renderedChild)
//                         }
//                     })
//                 }
//             } else {
//                 // Regular children rendering (no binding)
//                 children.forEach((child: any, index: number) => {
//                     const childKey = `child-${index}`
//                     const renderedChild = renderComponent(child, currentData, childKey)
//                     if (renderedChild) {
//                         renderedChildren.push(renderedChild)
//                     }
//                 })
//             }

//             // Handle self-closing tags
//             const selfClosingTags = new Set([
//                 'img', 'input', 'br', 'hr', 'meta', 'link',
//                 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr', 'iconify-icon'
//             ])

//             if (selfClosingTags.has(normalizedType)) {
//                 if (normalizedType === 'iconify-icon') {
//                     return React.createElement('iconify-icon', {
//                         ...processedProps,
//                         icon: processedProps.icon || processedProps.iconName
//                     })
//                 }
//                 return React.createElement(normalizedType, processedProps)
//             }

//             return React.createElement(
//                 normalizedType,
//                 processedProps,
//                 renderedChildren.length > 0 ? renderedChildren : null
//             )
//         } catch (error) {
//             console.error('Render error:', error, 'Component:', component)
//             return (
//                 <div className="p-2 border border-red-300 bg-red-50 rounded text-sm">
//                     <span className="text-red-600">Error rendering component: {id}</span>
//                 </div>
//             )
//         }
//     }

//     if (!schema) {
//         return (
//             <div className="p-4 text-gray-500">
//                 No UI schema provided
//             </div>
//         )
//     }

//     try {
//         return (
//             <div className="generated-ui relative">
//                 {/* Refresh button for queries */}
//                 {schema.query && onRefresh && (
//                     <button
//                         onClick={onRefresh}
//                         className="absolute top-2 right-2 z-10 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
//                         type="button"
//                     >
//                         🔄 Refresh
//                     </button>
//                 )}

//                 {renderComponent(schema, data, 'root')}
//             </div>
//         )
//     } catch (error) {
//         console.error('UIRenderer top-level error:', error)
//         return (
//             <div className="generated-ui p-4 border border-red-300 bg-red-50 rounded">
//                 <p className="text-red-600 font-medium">Error rendering UI</p>
//                 <p className="text-red-500 text-sm mt-1">Check console for details</p>
//                 <details className="mt-2">
//                     <summary className="cursor-pointer text-sm">Debug Info</summary>
//                     <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto">
//                         Schema: {JSON.stringify(schema, null, 2)}
//                         {'\n'}Data: {JSON.stringify(data, null, 2)}
//                     </pre>
//                 </details>
//             </div>
//         )
//     }
// }

// export default UIRenderer;



// version 2 
// // import React from 'react'
// // import Chart from '@/data_registry_comp/chart'
// // import DynamicCard from '@/data_registry_comp/card'




// // interface UIRendererProps {
// //     schema: any
// //     data?: any
// //     handlers?: Record<string, Function>
// //     isStreaming?: boolean
// //     onRefresh?: () => void
// // }




// // /**
// //  * Replace {{path.to.value}} in strings with actual values from `data`
// //  */
// // const resolveDataBinding = (text: string, data: any): string => {
// //     if (!text || typeof text !== 'string' || !data) return text

// //     const bindingRegex = /\{\{([^}]+)\}\}/g
// //     return text.replace(bindingRegex, (match, path) => {
// //         try {
// //             const value = path.split('.').reduce((cur: any, key: string) => {
// //                 if (cur === null || cur === undefined) return ''
// //                 if (!isNaN(Number(key))) {
// //                     const index = parseInt(key, 10)
// //                     return Array.isArray(cur) ? cur[index] : cur
// //                 }
// //                 return cur[key]
// //             }, data)
// //             return value !== undefined && value !== null ? String(value) : ''
// //         } catch {
// //             return match
// //         }
// //     })
// // }


// // // this is for edxpression

// // const evaluate = (expression: string, data: any): any => {
// //     const keys = Object.keys(data);
// //     const values = Object.values(data);

// //     try {
// //         const fn = new Function(...keys, `return (${expression})`);
// //         return fn(...values);
// //     } catch (error) {
// //         console.error('Expression evaluation error:', expression, error);
// //         return undefined;
// //     }
// // }



// // const resolveExp = (obj: any, context: any) => {
// //     if (!obj) return obj;

// //     if (typeof obj === 'object' && obj.$exp) {
// //         return evaluate(obj.$exp, context);
// //     }

// //     if (typeof obj === 'object') {
// //         const res: any = Array.isArray(obj) ? [] : {};
// //         for (const key in obj) {
// //             res[key] = resolveExp(obj[key], context);
// //         }
// //         return res;
// //     }

// //     return obj;
// // }

// // const customComponents: Record<string, React.FC<any>> = {
// //     chart: Chart,
// //     card: DynamicCard,
// //     // add more custom components here, like Card
// // };

// // const UIRenderer = ({ schema, data, onRefresh }: UIRendererProps) => {
// //     const renderComponent = (
// //         component: any,
// //         contextData: any = data,
// //         key?: number | string,
// //     ): React.ReactNode => {
// //         // Handle text node
// //         if (typeof component === 'string') {
// //             return resolveDataBinding(component, contextData)
// //         }

// //         if (!component || typeof component !== 'object') return null

// //         const { id, type, props = {}, children = [], binding, dataPath } = component

// //         if (!type || typeof type !== 'string') {
// //             console.warn('Component missing type:', component)
// //             return null
// //         }





// //         const normalizedType = type.toLowerCase().trim()

// //         // ✅ Only allow safe HTML tags
// //         const validHtmlTags = new Set([
// //             'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
// //             'button', 'input', 'textarea', 'select', 'option', 'label',
// //             'form', 'fieldset', 'legend', 'img', 'a', 'ul', 'ol', 'li',
// //             'table', 'thead', 'tbody', 'tr', 'td', 'th', 'nav', 'header',
// //             'footer', 'main', 'section', 'article', 'aside', 'br', 'hr',
// //             'strong', 'em', 'small', 'code', 'pre', 'blockquote', 'cite',
// //             'canvas', 'svg', 'video', 'audio', 'iframe', 'embed', 'object',
// //             'iconify-icon'
// //         ])
// //         const isHtmlTag = validHtmlTags.has(normalizedType);
// //         const CustomComp = customComponents[normalizedType];



// //         if (!isHtmlTag && !CustomComp) {
// //             console.warn('Unknown component type:', type);
// //             return null;
// //         }


// //         try {
// //             // Get the appropriate data context
// //             let currentData = contextData

// //             // If component has dataPath, navigate to that data
// //             if (dataPath && contextData) {
// //                 currentData = dataPath.split('.').reduce((cur: any, key: string) => cur?.[key], contextData)
// //             }

// //             // Process props with data binding
// //             const processedProps: any = resolveExp(props, currentData);
// //             for (const key in processedProps) {
// //                 if (typeof processedProps[key] === 'string') {
// //                     processedProps[key] = resolveDataBinding(processedProps[key], currentData);
// //                 }
// //             }



// //             // Hook up handlers
// //             // if (processedProps.onClick && typeof processedProps.onClick === 'string') {
// //             //     const fn = handlers[processedProps.onClick]
// //             //     processedProps.onClick = typeof fn === 'function'
// //             //         ? fn
// //             //         : () => console.warn(`Missing handler: ${processedProps.onClick}`)
// //             // }
// //             if (processedProps.onClick) {
// //                 if (typeof processedProps.onClick === 'object' && processedProps.onClick.$exp) {
// //                     processedProps.onClick = evaluate(processedProps.onClick.$exp, data);
// //                 }
// //                 if (typeof processedProps.onClick !== 'function') {
// //                     processedProps.onClick = () => console.warn('Missing handler');
// //                 }
// //             }



// //             // --- HANDLE FOR LOOP ---
// //             if (component.for) {
// //     let loopData: any[] = [];

// //     // Determine data source
// //     if (component.for.in?.$bind) {
// //         loopData = component.for.in.$bind.split('.').reduce((cur: any, k: string) => cur?.[k], contextData) || [];
// //     } else if (component.for.in?.$exp) {
// //         loopData = evaluate(component.for.in.$exp, contextData) || [];
// //     }

// //     const loopAs = component.for.as || "item";
// //     const loopIndex = component.for.index || "index";

// //     return loopData.flatMap((item, idx) => {
// //         const newContext = { ...contextData, [loopAs]: item, [loopIndex]: idx };
// //         const childrenArray = Array.isArray(component.children) ? component.children : [component.children];

// //         return childrenArray.map((child: any, cidx: any) => {
// //             // Compute key per iteration
// //             const loopKey = component.for.key;
// //             const finalKey = loopKey
// //                 ? (typeof loopKey === 'string' ? resolveDataBinding(loopKey, newContext) : resolveExp(loopKey, newContext))
// //                 : `${idx}-${cidx}`;

// //             return renderComponent(child, newContext, finalKey);
// //         });
// //     });
// // }



// //             // for the custom comp

// //             if (CustomComp) {
// //                 // Process props with $exp and $bind
// //                 const processedProps: any = { ...props };
// //                 Object.keys(processedProps).forEach(propKey => {
// //                     const propVal = processedProps[propKey]
// //                     if (typeof propVal === 'string') {
// //                         processedProps[propKey] = resolveDataBinding(propVal, currentData)
// //                     } else if (propVal && propVal.$exp) {
// //                         processedProps[propKey] = evaluate(propVal.$exp, { ...currentData, methods: data.methods })
// //                     } else if (propVal && propVal.$bind) {
// //                         processedProps[propKey] = propVal.$bind.split('.').reduce((acc: any, k: any) => acc?.[k], currentData)
// //                     }
// //                 })


// //                 return <CustomComp {...processedProps} key={key} />;
// //             }



// //             // Add key for React reconciliation
// //             if (key !== undefined) processedProps.key = key

// //             // Handle children rendering
// //             let renderedChildren: React.ReactNode[] = []

// //             if (children.$exp) {
// //                 const value = evaluate(children.$exp, currentData);
// //                 return value !== undefined ? String(value) : null;
// //             }


// //             // 🔥 NEW: Handle binding on this component
// //             if (binding && currentData && currentData[binding]) {
// //                 const boundData = currentData[binding]

// //                 if (Array.isArray(boundData)) {
// //                     // For each item in the bound array, render all children with that item as context
// //                     boundData.forEach((item, index) => {
// //                         children.forEach((child: any, childIndex: number) => {
// //                             const childKey = `${binding}-${index}-${childIndex}`
// //                             const renderedChild = renderComponent(child, item, childKey)
// //                             if (renderedChild) {
// //                                 renderedChildren.push(renderedChild)
// //                             }
// //                         })
// //                     })
// //                 } else {
// //                     // Single object binding
// //                     children.forEach((child: any, childIndex: number) => {
// //                         const childKey = `${binding}-${childIndex}`
// //                         const renderedChild = renderComponent(child, boundData, childKey)
// //                         if (renderedChild) {
// //                             renderedChildren.push(renderedChild)
// //                         }
// //                     })
// //                 }
// //             } else {
// //                 let childrenArray: any[] = []

// //                 if (children) {
// //                     if (Array.isArray(children)) {
// //                         childrenArray = children
// //                     } else if (typeof children === 'object' || typeof children === 'string') {
// //                         childrenArray = [children]
// //                     }
// //                 }
// //                 // Regular children rendering (no binding)
// //                 childrenArray.forEach((child: any, index: number) => {
// //                     const childKey = `child-${index}`
// //                     const renderedChild = renderComponent(resolveExp(child, currentData), currentData, childKey);
// //                     if (renderedChild) {
// //                         renderedChildren.push(renderedChild)
// //                     }
// //                 })
// //             }

// //             // Handle self-closing tags
// //             const selfClosingTags = new Set([
// //                 'img', 'input', 'br', 'hr', 'meta', 'link',
// //                 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr', 'iconify-icon'
// //             ])

// //             if (selfClosingTags.has(normalizedType)) {
// //                 if (normalizedType === 'iconify-icon') {
// //                     return React.createElement('iconify-icon', {
// //                         ...processedProps,
// //                         icon: processedProps.icon || processedProps.iconName
// //                     })
// //                 }
// //                 return React.createElement(normalizedType, processedProps)
// //             }

// //             return React.createElement(
// //                 normalizedType,
// //                 processedProps,
// //                 renderedChildren.length > 0 ? renderedChildren : null
// //             )
// //         } catch (error) {
// //             console.error('Render error:', error, 'Component:', component)
// //             return (
// //                 <div className="p-2 border border-red-300 bg-red-50 rounded text-sm">
// //                     <span className="text-red-600">Error rendering component: {id}</span>
// //                 </div>
// //             )
// //         }
// //     }

// //     if (!schema) {
// //         return (
// //             <div className="p-4 text-gray-500">
// //                 No UI schema provided
// //             </div>
// //         )
// //     }

// //     try {
// //         return (
// //             <div className="generated-ui relative">
// //                 {/* Refresh button for queries */}
// //                 {schema.query && onRefresh && (
// //                     <button
// //                         onClick={onRefresh}
// //                         className="absolute top-2 right-2 z-10 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
// //                         type="button"
// //                     >
// //                         🔄 Refresh
// //                     </button>
// //                 )}

// //                 {renderComponent(schema, data, 'root')}
// //             </div>
// //         )
// //     } catch (error) {
// //         console.error('UIRenderer top-level error:', error)
// //         return (
// //             <div className="generated-ui p-4 border border-red-300 bg-red-50 rounded">
// //                 <p className="text-red-600 font-medium">Error rendering UI</p>
// //                 <p className="text-red-500 text-sm mt-1">Check console for details</p>
// //                 <details className="mt-2">
// //                     <summary className="cursor-pointer text-sm">Debug Info</summary>
// //                     <pre className="text-xs bg-gray-100 p-2 mt-1 rounded overflow-auto">
// //                         Schema: {JSON.stringify(schema, null, 2)}
// //                         {'\n'}Data: {JSON.stringify(data, null, 2)}
// //                     </pre>
// //                 </details>
// //             </div>
// //         )
// //     }
// // }



// version 3

// export default UIRenderer;

import React from 'react'
import Chart from '@/data_registry_comp/chart'
import DynamicCard from '@/data_registry_comp/card'

interface UIRendererProps {
    schema: any
    data?: any
    handlers?: Record<string, Function>
    isStreaming?: boolean
    onRefresh?: () => void
}

/** Replace {{path.to.value}} in strings with actual values from `data` */
const resolveDataBinding = (text: string, data: any): string => {
    if (!text || typeof text !== 'string' || !data) return text

    const bindingRegex = /\{\{([^}]+)\}\}/g
    return text.replace(bindingRegex, (match, path) => {
        try {
            const value = path.split('.').reduce((cur: any, key: string) => {
                if (cur === null || cur === undefined) return ''
                if (!isNaN(Number(key))) {
                    const index = parseInt(key, 10)
                    return Array.isArray(cur) ? cur[index] : cur
                }
                return cur[key]
            }, data)
            return value !== undefined && value !== null ? String(value) : ''
        } catch {
            return match
        }
    })
}

/** Evaluate $exp expressions */
const evaluate = (expression: string, data: any): any => {
    try {
        // Handle functions stored as strings e.g. "() => console.log('hi')"
        if (expression.trim().startsWith('()')) {
            return new Function('return ' + expression)()
        }
        const keys = Object.keys(data)
        const values = Object.values(data)
        const fn = new Function(...keys, `return (${expression})`)
        return fn(...values)
    } catch (error) {
        console.error('Expression evaluation error:', expression, error)
        return undefined
    }
}

/** Recursively resolve $exp in object */
const resolveExp = (obj: any, context: any) => {
    if (!obj) return obj
    if (typeof obj === 'object' && obj.$exp) return evaluate(obj.$exp, context)
    if (typeof obj === 'object') {
        const res: any = Array.isArray(obj) ? [] : {}
        for (const key in obj) res[key] = resolveExp(obj[key], context)
        return res
    }
    return obj
}

const customComponents: Record<string, React.FC<any>> = {
    chart: Chart,
    card: DynamicCard,
}

const UIRenderer = ({ schema, data, onRefresh }: UIRendererProps) => {
    const renderComponent = (
        component: any,
        contextData: any = data,
        key?: string | number
    ): React.ReactNode => {
        if (typeof component === 'string') return resolveDataBinding(component, contextData)
        if (!component || typeof component !== 'object') return null

        const { id, type, props = {}, children = [], binding, dataPath } = component

        // Special case: loop node (without explicit type)
        if (!type && component.for) {
            let loopData: any[] = []
            if (component.for.in?.$bind) {
                loopData = component.for.in.$bind.split('.').reduce((cur: any, k: string) => cur?.[k], data) || []
            } else if (component.for.in?.$exp) {
                loopData = evaluate(component.for.in.$exp, contextData) || []
            }

            const loopAs = component.for.as || 'item'
            const loopIndex = component.for.index || 'index'
            const loopKey = component.for.key

            return loopData.flatMap((item, idx) => {
                const newContext = { ...contextData, [loopAs]: item, [loopIndex]: idx }
                const childrenArray = Array.isArray(component.children) ? component.children : [component.children]

                return childrenArray.map((child: any, cidx: any) => {
                    const finalKey = loopKey
                        ? (typeof loopKey === 'string'
                            ? resolveDataBinding(loopKey, newContext)
                            : resolveExp(loopKey, newContext))
                        : `${idx}-${cidx}`
                    return renderComponent(child, newContext, finalKey)
                })
            })
        }

        // Skip if no type and no for
        if (!type) return null


        const normalizedType = type.toLowerCase().trim()
        const validHtmlTags = new Set([
            'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'input', 'textarea',
            'select', 'option', 'label', 'form', 'fieldset', 'legend', 'img', 'a', 'ul', 'ol', 'li',
            'table', 'thead', 'tbody', 'tr', 'td', 'th', 'nav', 'header', 'footer', 'main', 'section',
            'article', 'aside', 'br', 'hr', 'strong', 'em', 'small', 'code', 'pre', 'blockquote', 'cite',
            'canvas', 'svg', 'video', 'audio', 'iframe', 'embed', 'object', 'iconify-icon'
        ])
        const isHtmlTag = validHtmlTags.has(normalizedType)
        const CustomComp = customComponents[normalizedType]

        if (!isHtmlTag && !CustomComp) return null

        try {
            let currentData = contextData
            if (dataPath && contextData) {
                currentData = dataPath.split('.').reduce((cur: any, k: string) => cur?.[k], contextData)
            }

            // Process props
            const processedProps: any = resolveExp(props, currentData)
            Object.keys(processedProps).forEach(k => {
                if (typeof processedProps[k] === 'string') {
                    processedProps[k] = resolveDataBinding(processedProps[k], currentData)
                }
            })

            // Hook up onClick handlers
            if (processedProps.onClick) {
                if (typeof processedProps.onClick === 'object' && processedProps.onClick.$exp) {
                    processedProps.onClick = evaluate(processedProps.onClick.$exp, data)
                }
                if (typeof processedProps.onClick !== 'function') {
                    processedProps.onClick = () => console.warn('Missing handler')
                }
            }


            // --- Custom components ---
            if (CustomComp) {
                const compProps: any = { ...props }
                Object.keys(compProps).forEach(propKey => {
                    const val = compProps[propKey]
                    if (typeof val === 'string') compProps[propKey] = resolveDataBinding(val, currentData)
                    else if (val?.$exp) compProps[propKey] = evaluate(val.$exp, { ...currentData, methods: data.methods })
                    else if (val?.$bind) compProps[propKey] = val.$bind.split('.').reduce((acc: any, k: any) => acc?.[k], data)
                })
                return <CustomComp {...compProps} key={key} />
            }

            if (key !== undefined) processedProps.key = key

            // --- Children rendering ---
            const renderedChildren: React.ReactNode[] = []

            // Handle children.$exp
            if (children && typeof children === 'object' && children.$exp) {
                const value = evaluate(children.$exp, currentData)
                return value !== undefined ? String(value) : null
            }

            // Handle binding
            if (binding && currentData && currentData[binding]) {
                const boundData = currentData[binding]
                const childrenArr = Array.isArray(children) ? children : [children]

                if (Array.isArray(boundData)) {
                    boundData.forEach((item, idx) => {
                        childrenArr.forEach((child, cidx) => {
                            const childKey = `${binding}-${idx}-${cidx}`
                            const rendered = renderComponent(child, item, childKey)
                            if (rendered) renderedChildren.push(rendered)
                        })
                    })
                } else {
                    childrenArr.forEach((child, cidx) => {
                        const childKey = `${binding}-${cidx}`
                        const rendered = renderComponent(child, boundData, childKey)
                        if (rendered) renderedChildren.push(rendered)
                    })
                }
            } else {
                const childrenArr = Array.isArray(children) ? children : [children]
                childrenArr.forEach((child, idx) => {
                    const rendered = renderComponent(resolveExp(child, currentData), currentData, `child-${idx}`)
                    if (rendered) renderedChildren.push(rendered)
                })
            }

            // Self-closing tags
            const selfClosing = new Set(['img', 'input', 'br', 'hr', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr', 'iconify-icon'])
            if (selfClosing.has(normalizedType)) {
                if (normalizedType === 'iconify-icon') {
                    return React.createElement('iconify-icon', { ...processedProps, icon: processedProps.icon || processedProps.iconName })
                }
                return React.createElement(normalizedType, processedProps)
            }

            return React.createElement(normalizedType, processedProps, renderedChildren.length ? renderedChildren : null)

        } catch (error) {
            console.error('Render error:', error, component)
            return (
                <div className="p-2 border border-red-300 bg-red-50 rounded text-sm">
                    <span className="text-red-600">Error rendering component: {id}</span>
                </div>
            )
        }
    }

    if (!schema) return <div className="p-4 text-gray-500">No UI schema provided</div>

    return (
        <div className="generated-ui relative">
            {schema.query && onRefresh && (
                <button
                    onClick={onRefresh}
                    className="absolute top-2 right-2 z-10 px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    type="button"
                >
                    🔄 Refresh
                </button>
            )}
            {renderComponent(schema, data, 'root')}
        </div>
    )
}

export default UIRenderer
