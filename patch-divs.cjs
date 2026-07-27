const fs = require('fs');
let code = fs.readFileSync('src/components/ReceiptModal.tsx', 'utf8');

const correctEnd = `
            {/* Footer message */}
            <div className="text-center pt-2 text-[10px] space-y-1">
              <p>Terimakasih telah berbelanja di<br/>Toko Kami</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
`;

code = code.replace(/\{\/\* Footer message \*\/\}[\s\S]*?\}\;/, correctEnd);
fs.writeFileSync('src/components/ReceiptModal.tsx', code);
