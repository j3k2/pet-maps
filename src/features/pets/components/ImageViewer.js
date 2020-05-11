import React, { Component } from 'react';
import { Image, Card, Icon, Modal } from 'semantic-ui-react';

class ImageViewer extends Component {
    state = {
        imageIndex: 0,
        modalOpen: false
    };

    render() {
        return (
            <Card style={{ minWidth: 268, width: 268 }}>
                <Image
                    style={{
                        margin: 20,
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        if (this.props.images && this.props.images.length) {
                            this.setState({ modalOpen: true });
                        }
                    }}
                    width={228}
                    height={228}
                    src={this.props.images ? this.props.images[this.state.imageIndex] : ''}></Image>
                {(!this.props.images || this.props.images.length === 0) && <span style={{ position: 'relative', bottom: 10, textAlign: 'center' }}>No photos</span>}
                {this.props.images && this.props.images.length === 1 && <span style={{ position: 'relative', bottom: 10, textAlign: 'center' }}>{this.state.imageIndex + 1}/{this.props.images.length}</span>}
                {this.props.images && this.props.images.length > 1 && <span style={{ textAlign: 'center' }}><Icon
                    onClick={() => {
                        this.setState({ imageIndex: this.state.imageIndex === 0 ? this.props.images.length - 1 : this.state.imageIndex - 1 })
                    }}
                    style={{ cursor: 'pointer', float: 'left', position: 'relative', left: 10, bottom: 10 }}
                    name="arrow alternate circle left"></Icon>
                    <span style={{ position: 'relative', bottom: 10 }}>
                        {this.state.imageIndex + 1}/{this.props.images.length}
                    </span>
                    <Icon
                        onClick={() => {
                            this.setState({ imageIndex: this.state.imageIndex === this.props.images.length - 1 ? 0 : this.state.imageIndex + 1 })
                        }}
                        style={{ cursor: 'pointer', float: 'right', position: 'relative', right: 10, bottom: 10 }}
                        name="arrow alternate circle right"></Icon></span>}
                <Modal style={{ width: 'auto', textAlign: 'center' }} open={this.state.modalOpen} onClose={() => {
                    this.setState({ modalOpen: false });
                }}>
                    <Image style={{ display: 'inline' }} src={this.props.images ? this.props.images[this.state.imageIndex] : ''}></Image>
                </Modal>
            </Card>
        )
    }
}

export default ImageViewer;