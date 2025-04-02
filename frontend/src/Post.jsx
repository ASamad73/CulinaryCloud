// import { useState } from 'react';

function Post() {
    return (
        <div className="post-info">
            <h3 className="post-heading">Ingredients</h3>
            <table className="post-table">
                <tr className="post-row">
                    <th className="post-table-heading">Ingredient</th>
                    <th className="post-table-heading">Quantity</th>
                    <th className="post-table-heading">Substitute</th>
                </tr>
                <tr className="post-row">
                    <td className="post-table-data">Chicken</td>
                    <td className="post-table-data">1 kg</td>
                    <td className="post-table-data">Beef</td>
                </tr>
            </table>
            <h3 className="post-cooking-heading">Cooking Process</h3>
            <div className="cooking-step">
                <i className="fa-solid fa-thumbtack"></i>
                <p className="cooking-step">Cooking process number one is blah blah</p>
            </div>
            <div className="start-trial">
                <button className='start-cooking'> Start Cooking </button>
            </div>
        </div>
    );
}

export default Post;
