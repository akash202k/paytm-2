"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const cors_1 = __importDefault(require("cors"));
const statusCode_1 = __importDefault(require("./util/statusCode"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.get('/', (req, res) => {
    res.status(statusCode_1.default.OK).json({ message: "Health Ok" });
});
app.use('/api/v1', index_1.default);
app.listen(port, () => {
    console.log(`paytm-2 backend running on port ${port}`);
});
app.use((err, req, res, next) => {
    console.log(err);
    res.status(statusCode_1.default.INTERNAL_SERVER_ERROR).json({
        error: "Internal Server Error"
    });
});
