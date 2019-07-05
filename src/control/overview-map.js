import React from 'react'
import PropTypes from 'prop-types'
import {View, Collection} from 'ol'
import {Layer} from 'ol/layer'
import OLControl from './ol-control'

import {OverviewMap as Overview} from 'ol/control'
// This one not working for me 2019-06-28
//import Overview from 'ol-ext/control/Overview'

export default class OLOverviewMap extends OLControl {
    static propTypes = Object.assign({}, OLControl.propTypes, {
    	className: PropTypes.string,
    	collapsed: PropTypes.bool,
    	collapseLabel: PropTypes.string,
    	collapsible: PropTypes.bool,
    	label: PropTypes.node,
    	layers: PropTypes.oneOfType([
    	    PropTypes.arrayOf(PropTypes.instanceOf(Layer)),
    	    PropTypes.instanceOf(Collection)
    	]),
    	tipLabel: PropTypes.string,
    	view: PropTypes.instanceOf(View),
        target: PropTypes.string
    })

    // Everything stops working if these are false.
    static defaultProps = {
        collapsed: true,
        collapsible: true,
    }

    componentDidMount() {
    }

    createControl (props) {
        console.log("la de da");
        this.overviewmap = new Overview({
            //className: props.className,
            collapsed: this.props.collapsed,
            collapseLabel: this.props.collapseLabel,
            collapsible: this.props.collapsible,
            //label: this.props.label,
            layers: this.props.layers,
            //tipLabel: this.props.tipLabel,
            //view: this.props.view,
            // defaults
            //minZoom: 0, maxZoom: 18, rotation: 0,
            //projection: wm,
            align: 'right',
            //style:
            panAnimation: "elastic"
        })
        this.overviewmap.setTarget(this.props.target)
    }

    componentDidUpdate() {
        console.log("update. Am i collapsed? ", this.props.collapsed);
        this.overviewmap.setCollapsed(this.props.collapsed);
    }
}
