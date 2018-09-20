var JSONP = {
    now: function () {
        return (new Date()).getTime()
    },
    rand: function () {
        return Math.random().toString().substr(2)
    },
    removeElem: function (elem) {
        var parent = elem.parentNode
        if(parent && parent.nodeType !== 11) {
            parent.removeChild(elem)
        }
    },
    parseData: function (data) {
        var ret = ""
        if(typeof data === "string") {
            ret = data
        }
        else if(typeof data === "object") {
            for(var key in data) {
                ret += "&" + key + "=" + encodeURIComponent(data[key])
            }
        }
        ret += "&_time=" + this.now()
        ret = ret.substr(1)
        return ret
    },
    getJSON: function (url, data, func) {
        var name
        url = url + (url.indexOf("?") === -1 ? "?" : "&") + this.parseData(data)    
        var match = /callback=(\w+)/.exec(url)
        if(match && match[1]) {
            name = match[1]
        } else {
            name = "jsonp_" + this.now() + '_' + this.rand()
            url = url.replace("callback=?", "callback="+name)
            url = url.replace("callback=%3F", "callback="+name)
        }
        var script = document.createElement("script")
        script.type = "text/javascript"
        script.src = url
        script.id = "id_" + name
        window[name] = function (json) {
            window[name] = undefined
            var elem = document.getElementById("id_" + name)
            JSONP.removeElem(elem)
            func(json)
        }
        var head = document.getElementsByTagName("head")
        if(head && head[0]) {
            head[0].appendChild(script)
        }
    }
}
export default JSONP