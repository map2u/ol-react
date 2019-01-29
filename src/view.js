import React from 'react'
import PropTypes from 'prop-types'
import {MapContext} from './map-context'
import {Map, View} from 'ol'
import OLComponent from './ol-component'

const wgs84 = "EPSG:4326";
const wm = "EPSG:3857";

export default class OLView extends OLComponent {
    static contextType = MapContext;
    static propTypes = {
        center: PropTypes.arrayOf(PropTypes.number),
        resolution: PropTypes.number,
        zoom: PropTypes.number,
        rotation: PropTypes.number,
        initialCenter: PropTypes.arrayOf(PropTypes.number),
        initialResolution: PropTypes.number,
        initialZoom: PropTypes.number,
        initialRotation: PropTypes.number,
        onResolutionChanged: PropTypes.func,
        onZoomChanged: PropTypes.func,
        onCenterChanged: PropTypes.func,
        projection: PropTypes.string,
    }
    static defaultProps = {
        initialCenter: [0, 0],
        initialResolution: 10000,
        initialZoom: 0,
        initialRotation: 0
    }

    constructor(props) {
        super(props);
        let p = wm;
        if (typeof this.props.projection !== 'undefined') {
            p = this.props.projection;
        }
        var opts = {
            center: this.props.initialCenter,
            resolution: this.props.initialResolution,
            rotation: this.props.initialRotation,
            zoom: this.props.initialZoom,
            projection: p
        };
        this.view = new View(opts);
    }

    onMoveEnd(event) {
        if (this.props.onNavigation && this.props.initialCenter[0] !== this.view.getCenter()[0]) {
            // Don't fire an event unless we've actually moved from initial location
            this.props.onNavigation(
                this.view.getCenter(),
                this.view.getResolution(),
                this.view.getZoom(),
                this.view.getRotation()
            );
        }
    }

    updateFromProps_() {
        // FIXME we're probably ignoring some useful props here!!
        //console.log("view updateFromProps_()");

        // Set either Resolution OR zoom, but guard against 0 (will cause map to not render)
        if (typeof this.props.resolution !== 'undefined' && this.props.resolution !== 0) {
            //console.log("resolution set to", this.props.resolution);
            this.view.setResolution(this.props.resolution);
            return;
        }

        if (typeof this.props.zoom !== 'undefined'
        || typeof this.props.rotation !== 'undefined'
        || typeof this.props.rotation !== 'undefined') {
            this.view.animate(
                { zoom: this.props.zoom },
                { rotation: this.props.rotation, duration: 250 },
                { center: this.props.center },
            );
            // this.view.setZoom(this.props.zoom);
            // this.view.setCenter(this.props.center);
            // this.view.setRotation(this.props.rotation);
            console.log('rotation = ', this.props.rotation);
        }
    }

    componentDidMount() {
        //console.log("OLView.componentDidMount context", this.context)
        this.context.map.setView(this.view);
        this.updateFromProps_();
        this.context.map.on("movend", this.onMoveEnd, this);
    }

    componentDidUpdate() {
//        console.log("View.ComponentDidUpdate()", this.props.center);
//        this.view.setCenter(this.props.center)
        this.updateFromProps_();
    }

    fit(geometry, size, options) {
        this.view.fit(geometry, size, options);
    }
}
